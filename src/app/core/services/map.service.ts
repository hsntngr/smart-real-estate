import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {
  EventData,
  GeoJSONSource,
  LngLatBounds,
  LngLatLike,
  MapboxGeoJSONFeature,
  MapEventType,
  Point
} from 'mapbox-gl';
import { Feature, FeatureCollection, MultiPoint, Point as GeoJSONPoint } from 'geojson';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import bbox from '@turf/bbox';

import { environment } from '@environment';
import { MAP_IMAGES } from '@core/data/map-images.data';
import { MapOptions } from '@core/interfaces/map-options.interface';
import { MapConstants } from '@core/enums/map-constants.enum';
import { CLUSTER_LAYER, CLUSTER_POINT_COUNT_LAYER, PIN_LAYER } from '@core/data/layers.data';

/**
 * Abstract mapbox api with the MapService
 * All mapbox implementation must be handled with in the MapService
 * Exposed map api may cause future troubles when implementing new map library rather than mapbox
 * Interfaces might be exposed due to flexibility but the implementation must be abstracted
 */
@Injectable({ providedIn: 'root' })
export class MapService {
  private map: mapboxgl.Map;
  private preRequisitesCompleted$ = new BehaviorSubject(false);

  registerMap(options: MapOptions) {
    this.map = this.createMap(options);

    this.map.on('load', () => {
      this.registerImages();
      this.registerSources();
      this.registerLayers();
      this.registerCursorEvents();
    })
  }

  /**
   * Create new map instance
   * @param options
   * @private
   */
  private createMap(options: MapOptions) {
    return new mapboxgl.Map({
      ...options,
      accessToken: environment.mapbox.accessToken,
      style: environment.mapbox.style,
      attributionControl: false,
      zoom: 9.5,
      projection: { name: 'mercator' },
    });
  }

  /**
   * Third party images, icons etc. must be loaded before the features has been registered
   * @private
   */
  private registerImages() {
    let loadedImageCount = 0;
    for (const { alias, path } of MAP_IMAGES) {
      this.map.loadImage(`${environment.app.url}/${path}`, (error, result) => {
        loadedImageCount++;
        if (loadedImageCount === MAP_IMAGES.length) this.preRequisitesCompleted$.next(true);
        if (error) throw error;
        this.map.addImage(alias, result!);
      })
    }
  }

  /**
   * Register sources
   * @private
   */
  private registerSources() {
    const id = MapConstants.pinSourceName;
    this.map.addSource(id, {
      type: 'geojson',
      cluster: true,
      clusterMaxZoom: 15,
      clusterMinPoints: 3,
      clusterRadius: 25,
      data: { type: 'FeatureCollection', features: [] }
    });
  }

  /**
   * Register layers
   * @private
   */
  private registerLayers() {
    this.map.addLayer(PIN_LAYER)
    this.map.addLayer(CLUSTER_LAYER)
    this.map.addLayer(CLUSTER_POINT_COUNT_LAYER)
  }

  /**
   * Expose map load end event
   * @param callback
   */
  onMapLoadEnd(callback: () => void) {
    this.map.on('load', callback);
  }

  /**
   * Expose move end event
   * @param callback
   */
  onMoveEnd(callback: (event: MapEventType['moveend'] & EventData) => void) {
    this.map.on('moveend', callback)
  }

  /**
   * Expose click event
   * @param callback
   */
  onMapClick(callback: (event: MapEventType['click'] & EventData) => void) {
    this.map.on('click', callback);
  }


  /**
   * Register pin features
   * @param pins
   */
  setPins(pins: Feature | FeatureCollection) {
    if (this.preRequisitesCompleted$.getValue()) {
      const source = this.map.getSource(MapConstants.pinSourceName) as GeoJSONSource;
      source.setData(pins);
    } else {
      this.scheduleSetPins(pins);
    }
  }

  /**
   * Register cursor events based on clickable layers
   * @private
   */
  private registerCursorEvents() {
    this.map.on('mousemove', event => {
      const layers = [MapConstants.pinLayerName, MapConstants.clusterLayerName];
      const features = this.map.queryRenderedFeatures(event.point, { layers });
      document.body.style.cursor = features && features.length ? 'pointer' : 'default';
    })
  }

  /**
   * Get pin features on position
   * @param point
   */
  getPinsOnPosition(point: Point) {
    const layers = [MapConstants.pinLayerName];
    return this.map.queryRenderedFeatures(point, { layers });
  }

  getClustersOnPosition(point: Point) {
    const layers = [MapConstants.clusterLayerName];
    return this.map.queryRenderedFeatures(point, { layers });
  }

  private scheduleSetPins(pins: Feature | FeatureCollection) {
    interval(100)
      .pipe(
        filter(() => this.preRequisitesCompleted$.getValue()),
        take(1)
      )
      .subscribe(() => this.setPins(pins))
  }

  focus(center: LngLatLike, zoom: number) {
    this.map.flyTo({
      center,
      duration: 2000,
      maxDuration: 3000,
      zoom
    })
  }

  /**
   * Calculate the boundary box of the given cluster
   * @param cluster
   */
  getBoundaryBoxOfCluster(cluster: MapboxGeoJSONFeature) {
    return new Observable<LngLatBounds>(observer => {
      const source = this.map.getSource(MapConstants.pinSourceName) as GeoJSONSource;
      source.getClusterLeaves(+cluster.id, cluster.properties.point_count, 0, (error, features) => {
        if (error) return observer.error(error);
        const coordinates = features.map(x => (x.geometry as GeoJSONPoint).coordinates);
        const multipoint: MultiPoint = { type: 'MultiPoint', coordinates };
        observer.next(bbox(multipoint) as unknown as LngLatBounds)
      });
    })
  }

  /**
   * Zoom ın/out the given boundary box
   * @param bbox
   * @param center
   */
  focusBoundaryBbox(bbox: LngLatBounds, center?: LngLatLike) {
    this.map.fitBounds(bbox, {
      center,
      padding: window.outerWidth > 600 ? 200 : 50,
      duration: 1500,
      maxDuration: 3000,
    })
  }

  /**
   * Checks given position is rendered
   * @param position
   */
  checkPositionIsVisibleOnMap(position: LngLatLike) {
    return this.map.getBounds().contains(position);
  }

  destroy() {
    this.map.remove();
    this.map = null;
    this.preRequisitesCompleted$.next(false);
  }

  setCenter(center: [number, number]) {
    this.map.flyTo({
      center,
      duration: 1e3
    })
  }

  isInitiated() {
    return !!this.map;
  }
}

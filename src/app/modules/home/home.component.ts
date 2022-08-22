import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FeatureCollection, MultiPoint, Point as GeoJSONPoint, Point } from 'geojson';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { EventData, LngLatBounds, LngLatLike, MapboxGeoJSONFeature, MapEventType } from 'mapbox-gl';
import bbox from '@turf/bbox';
import distance from '@turf/distance';

import { AppState } from '@core/models/app-state.model';
import { MapService } from '@core/services/map.service';
import * as fromAgent from '@store/agent/state';
import { AgentInfo } from '@store/agent/models';
import * as fromRealEstate from '@store/real-estate/state';
import { RealEstateGeoJSONProperties, RealEstateListItem, RealEstateProperty, } from '@store/real-estate/models';
import centroid from '@turf/centroid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  center: [number, number] = [-97.3828125, 32.694865977]
  pins$: Observable<FeatureCollection<Point, RealEstateGeoJSONProperties>>;
  agent$: Observable<AgentInfo>;
  realEstateListItemsLoading$: Observable<boolean>;
  nearbyProperties$: Observable<RealEstateListItem[]>;
  selectedRealEstateProperty$: Observable<RealEstateProperty>;
  selectedRealEstatePropertyLoading$: Observable<boolean>;
  realEstateItems: RealEstateListItem[];
  adsSyncEnabled: boolean;
  propertyDetailsShown: boolean;
  adsVisible: boolean;

  private readonly destroyed$ = new Subject();

  constructor(
    private readonly store: Store<AppState>,
    private readonly mapService: MapService,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.registerRealEstateItems();
    this.registerSelectors();
    this.registerMapCenter();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  registerRealEstateItems() {
    // Used hard code list id and token. I believe context of the assessment is about
    // GIS skills rather than angular routing.
    // But of course angular features has been used as much as possible.
    const request = { listId: 5363950, token: '5AE7DFB40500DDC03BC84BD3F0A8AC0F18784B1E' };
    this.store.dispatch(fromRealEstate.fetchRealEstateList(request));
  }

  registerSelectors() {
    this.pins$ = this.store.select(fromRealEstate.selectRealEstatePins);
    this.agent$ = this.store.select(fromAgent.selectAgentInfo);
    this.realEstateListItemsLoading$ = this.store.select(fromRealEstate.selectRealEstateListItemsLoading);
    this.selectedRealEstateProperty$ = this.store.select(fromRealEstate.selectSelectedRealEstatePropertyDetails);
    this.selectedRealEstatePropertyLoading$ = this.store.select(fromRealEstate.selectSelectedRealEstatePropertyLoading);
    this.nearbyProperties$ = this.store.select(fromRealEstate.selectSelectedRealEstatePropertyDetails)
      .pipe(
        filter(property => !!property),
        map((property: RealEstateProperty) => {
          // Fetch real estate items and calculate distance between the selected item
          // If distance less than one mile return them as nearby properties
          const { Latitude, Longitude } = property.geocode;
          const propertyPointGeoJSON: GeoJSONPoint = { type: 'Point', coordinates: [+Longitude, +Latitude] };

          return this.realEstateItems.filter(item => {
            if (item.propertyID === property.propertyID) return false;
            const { Latitude, Longitude } = item.geocode;
            const itemPointGeoJSON: GeoJSONPoint = { type: 'Point', coordinates: [+Longitude, +Latitude] }
            return distance(itemPointGeoJSON, propertyPointGeoJSON, { units: 'miles' }) < 1;
          });
        })
      );
    this.store.select(fromRealEstate.selectRealEstateListItems)
      .pipe(
        takeUntil(this.destroyed$),
        map(items => items.filter(x => this.isSummaryItemVisibleOnMap(x)))
      )
      .subscribe(items => {
        this.realEstateItems = items;
        this.cdr.markForCheck();
      });
  }

  /**
   * Focus the center of the pin when clicked
   * @param feature
   */
  onPinClick(feature: MapboxGeoJSONFeature) {
    const [lng, lat] = (feature.geometry as GeoJSONPoint).coordinates;
    const position: LngLatLike = { lng, lat };
    this.showPropertyDetails(position, feature.properties.id);
  }

  /**
   * Focus the center of the cluster when clicked
   * @param cluster
   */
  onClusterClick(cluster: MapboxGeoJSONFeature) {
    this.mapService.getBoundaryBoxOfCluster(cluster)
      .pipe(take(1))
      .subscribe(bbox => {
        const [lng, lat] = (cluster.geometry as Point).coordinates;
        this.mapService.focusBoundaryBbox(bbox, { lng, lat });
      });
  }

  onSummaryCardClick({ geocode, propertyID }: RealEstateListItem) {
    const { Longitude, Latitude } = geocode;
    const position: LngLatLike = { lng: +Longitude, lat: +Latitude };
    this.showPropertyDetails(position, propertyID);
  }

  /**
   * Show property details by given property id
   * Focus given position on map
   * @param position
   * @param propertyId
   */
  showPropertyDetails(position: LngLatLike, propertyId: number) {
    this.adsVisible = false;
    setTimeout(() => {
      this.adsVisible = true;
      this.cdr.markForCheck();
    }, 1500);
    this.propertyDetailsShown = true;
    this.mapService.focus(position, 18);
    const request = {
      listId: 5363950,
      token: '5AE7DFB40500DDC03BC84BD3F0A8AC0F18784B1E',
      propertyId
    };
    this.store.dispatch(fromRealEstate.fetchRealEstatePropertyDetails(request))
  }

  /**
   *
   * @param item
   */
  onFavoriteToggleClick(item: RealEstateListItem) {
    this.store.dispatch(fromRealEstate.realEstateToggleFavorite({ payload: item.propertyID }));
  }

  /**
   * Toggle adsSyncEnabled and reload real item list
   */
  onToggleSync() {
    this.reloadRealEstateItems();
  }

  /**
   * Register when map move event. Reload real estate items list.
   * @param event
   */
  onMapMoveEnd(event: MapEventType['moveend'] & EventData) {
    this.reloadRealEstateItems();
  }

  /**
   * Reload real estate items and check is visible when adsSyncEnabled set true
   */
  reloadRealEstateItems() {
    this.store.select(fromRealEstate.selectRealEstateListItems)
      .pipe(
        map(items => items.filter(x => this.isSummaryItemVisibleOnMap(x))),
        take(1)
      )
      .subscribe(items => {
        this.realEstateItems = items;
        this.cdr.markForCheck();
      });
  }

  trackBySummaryCard(index: number, item: RealEstateListItem) {
    return item.propertyID;
  }

  /**
   * If adsSyncEnabled check pin visible on the current viewport
   * Checks pin position inside the map's boundary box
   * @param summary
   */
  isSummaryItemVisibleOnMap(summary: RealEstateListItem) {
    if (this.adsSyncEnabled) {
      const { Longitude, Latitude } = summary.geocode;
      const position: LngLatLike = { lng: +Longitude, lat: +Latitude };
      return this.mapService.checkPositionIsVisibleOnMap(position);
    }

    return true;
  }

  /**
   * Cancel property details preview
   * Turn back to the real item list
   * Zoom out to the boundary box contains all pins
   */
  onCancelRealEstatePropertyDetails() {
    this.propertyDetailsShown = false;
    this.store.dispatch(fromRealEstate.cancelRealEstatePropertyDetails());
    this.store.select(fromRealEstate.selectRealEstatePins)
      .pipe(take(1))
      .subscribe(collection => {
        const boundaryBox = bbox(collection) as [number, number, number, number];
        const bounds = new LngLatBounds(boundaryBox);
        this.mapService.focusBoundaryBbox(bounds)
      });
  }

  private registerMapCenter() {
    return this.pins$.pipe(
      map(pins => {
        if (pins) {
          const coordinates = pins.features.map(x => x.geometry.coordinates);
          const multipoint: MultiPoint = { type: 'MultiPoint', coordinates };
          return centroid(multipoint).geometry.coordinates as [number, number];
        }
        return this.center;
      }),
      filter(([lon, lat]: [number, number]) => {
        const [currLong, currLat] = this.center;
        return !(lon === currLong && lat === currLat);
      }),
      takeUntil(this.destroyed$),
    ).subscribe(center => {
      this.center = center;
      this.cdr.markForCheck();
    });
  }
}

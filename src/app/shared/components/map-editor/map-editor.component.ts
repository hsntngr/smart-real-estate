import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, EventEmitter,
  Input, OnChanges,
  OnDestroy,
  OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import { MapService } from '@core/services/map.service';
import { Feature, FeatureCollection, Point } from 'geojson';
import { RealEstateGeoJSONProperties } from '@store/real-estate/models/real-estate-geojson-properties.model';
import { EventData, MapboxGeoJSONFeature, MapEventType } from 'mapbox-gl';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapEditorComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() pins: FeatureCollection<Point, RealEstateGeoJSONProperties>;
  @Input() zoom: number = 10;
  @Input() center: [number, number] = [-97.662277, 30.281602];

  @Output() pinClick = new EventEmitter<MapboxGeoJSONFeature>();
  @Output() clusterClick = new EventEmitter<MapboxGeoJSONFeature>();
  @Output() mapMoveEnd = new EventEmitter<MapEventType['moveend'] & EventData>();

  @ViewChild('mapContainerRef', { read: ElementRef }) mapContainerRef: ElementRef<HTMLDivElement>;

  constructor(private readonly mapService: MapService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    /**
     * Reload pins when pins input has been changed.
     * Pins loaded through the mapbox api which can not detect angular io changes
     * We must manually pass these changes to the mapbox
     */
    if (changes?.pins?.currentValue !== changes?.pins?.previousValue) {
      this.mapService.setPins(changes.pins.currentValue)
    }

    /**
     * Move center of pins when pins loaded
     */
    if (changes?.center?.currentValue !== changes?.center?.previousValue) {
      if (this.mapService.isInitiated()) {
        this.mapService.setCenter(changes.center.currentValue)
      }
    }
  }

  /**
   * Initiate the map when angular rendered the template
   */
  ngAfterViewInit(): void {
    const { center } = this;
    const { nativeElement: container } = this.mapContainerRef;
    this.mapService.registerMap({ container, center });

    this.mapService.onMapLoadEnd(() => {
      this.mapService.setPins(this.pins);
      this.registerEvents();
    });
    this.mapService.onMoveEnd(event => {
      this.mapMoveEnd.emit(event)
    });
  }

  ngOnDestroy(): void {
    this.mapService.destroy();
  }

  /**
   * Register map component output events and bind them to the mapbox events
   * @private
   */
  private registerEvents() {
    this.mapService.onMapClick(event => {
      const clusters = this.mapService.getClustersOnPosition(event.point);
      if (clusters && clusters.length) {
        const [cluster] = clusters;
        this.clusterClick.emit(cluster);
        return;
      }

      const pins = this.mapService.getPinsOnPosition(event.point);
      if (pins && pins.length) {
        const [feature] = pins;
        this.pinClick.emit(feature);
      }
    })
  }
}

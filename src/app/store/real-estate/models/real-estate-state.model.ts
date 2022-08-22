import { RealEstateListItem } from './real-estate-list-item.model';
import { RealEstateProperty } from './real-estate-property.model';
import { FeatureCollection, Point } from 'geojson';
import { RealEstateGeoJSONProperties } from '@store/real-estate/models/real-estate-geojson-properties.model';

export interface RealEstateState {
  itemsLoading: boolean;
  items: RealEstateListItem[];
  pins: FeatureCollection<Point, RealEstateGeoJSONProperties>;
  selectedRealEstateProperty: RealEstateProperty;
  selectedRealEstatePropertyLoading: boolean;
}

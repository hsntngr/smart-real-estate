import { FloorPlan } from './real-estate-floor-plan.model';
import { Geocode } from './real-estate-geocode.model';

export interface RealEstateListItem {
  city: string;
  favorite: boolean;
  floorplans: FloorPlan[];
  geocode: Geocode;
  highValueAmenities: string[];
  highestSentCommissions: number;
  listID: number;
  name: string;
  onsiteManager: string;
  order: number;
  paidUtilities: []
  pets: boolean;
  photo: string;
  propertyID: number;
  proximity: number;
  section8: boolean;
  seniorHousing: boolean;
  state: string;
  streetAddress: string;
  studentHousting: boolean;
  washerDry: string;
}

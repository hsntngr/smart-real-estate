import { FloorPlan } from './real-estate-floor-plan.model';
import { Geocode } from './real-estate-geocode.model';
import { RealEstateParking } from './real-estate-parking.model';
import { RealEstatePetInfo } from './real-estate-pet-info.model';
import { NearbySchools } from './nearby-school.model';

export interface RealEstateProperty {
  adminFee: boolean;
  appFee: boolean;
  city: string;
  email: string;
  favorite: boolean;
  floorplans: FloorPlan[];
  geocode: Geocode;
  highValueAmenities: string[];
  listID: boolean;
  name: string;
  neighborhood: string;
  notes: string;
  numUnits: boolean;
  officeHours: number;
  paidUtilities: any[]
  parking: RealEstateParking;
  petInfo: RealEstatePetInfo;
  phone: string;
  photos: string[];
  propertyAmenities: string[];
  propertyID: number;
  regionalEmail: string;
  regionalName: string;
  regionalPhone: string;
  role: string;
  schoolsInfo: NearbySchools;
  section8: boolean;
  seniorHousing: boolean;
  specials: string;
  streetAddress: string;
  studentHousting: boolean;
  unitAmenities: string[];
  url: string;
  yearBuilt: string;
  yearRenovated: number;
}

import { createAction, props } from '@ngrx/store';

import { RealEstateListItem, RealEstateProperty } from '@store/real-estate/models';

export enum RealEstateActionTypes {
  fetchRealEstateList = '[Real Estate] Fetch Real Estate List',
  setRealEstateList = '[Real Estate] Set Real Estate List',
  realEstateToggleFavorite = '[Real Estate] Toggle Favorite',
  fetchRealEstatePropertyDetails = '[Real Estate] Fetch Real Estate Property Details',
  cancelRealEstatePropertyDetails = '[Real Estate] Cancel Real Estate Property Details',
  setRealEstatePropertyDetails = '[Real Estate] Set Real Estate Property Details',
  errorOccurred = '[Real Estate] error Occurred'
}

export const fetchRealEstateList = createAction(RealEstateActionTypes.fetchRealEstateList, props<{ listId: number, token: string }>());
export const setRealEstateList = createAction(RealEstateActionTypes.setRealEstateList, props<{ payload: RealEstateListItem[] }>());
export const realEstateToggleFavorite = createAction(RealEstateActionTypes.realEstateToggleFavorite, props<{ payload: number }>());
export const fetchRealEstatePropertyDetails = createAction(RealEstateActionTypes.fetchRealEstatePropertyDetails, props<{ listId: number, token: string, propertyId: number }>());
export const cancelRealEstatePropertyDetails = createAction(RealEstateActionTypes.cancelRealEstatePropertyDetails);
export const setRealEstatePropertyDetails = createAction(RealEstateActionTypes.setRealEstatePropertyDetails, props<{ payload: RealEstateProperty }>());
export const errorOccurred = createAction(RealEstateActionTypes.errorOccurred, props<{ error: string }>());

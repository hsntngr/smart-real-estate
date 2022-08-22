import produce from 'immer';
import { FeatureCollection, Point } from 'geojson';
import { createReducer, on } from '@ngrx/store';

import * as RealEstateActions from './real-estate.actions';
import { RealEstateListItem, RealEstateState } from '@store/real-estate/models';
import { createPinFeatureCollectionFromRealEstateList } from '@store/real-estate/utils/pin.utils';
import { RealEstateGeoJSONProperties } from '@store/real-estate/models/real-estate-geojson-properties.model';

export const REAL_ESTATES_FEATURE_KEY = 'realEstates';

export const initialState: RealEstateState = {
  items: [],
  pins: null,
  itemsLoading: false,
  selectedRealEstateProperty: null,
  selectedRealEstatePropertyLoading: false
}

export const realEstateReducer = createReducer<RealEstateState>(
  initialState,
  on(RealEstateActions.fetchRealEstateList, (state ) => ({
    ...state,
    itemsLoading: true,
  })),
  on(RealEstateActions.setRealEstateList, (state, { payload }) => ({
    ...state,
    items: payload,
    pins: createPinFeatureCollectionFromRealEstateList(payload),
    itemsLoading: false,
  })),
  on(RealEstateActions.fetchRealEstatePropertyDetails, (state, { propertyId }) => ({
    ...state,
    selectedRealEstateProperty: null,
    selectedRealEstatePropertyLoading: true,
    pins: produce<FeatureCollection<Point, RealEstateGeoJSONProperties>>(state.pins, draft => {
      for (let feature of draft.features) {
        feature.properties.selected = feature.properties.id === propertyId
      }
    })
  })),
  on(RealEstateActions.realEstateToggleFavorite, (state, { payload }) => ({
    ...state,
    items: produce<RealEstateListItem[]>(state.items, draft => {
      const index = draft.findIndex(x => x.propertyID === payload)
      if (index > -1) draft[index].favorite = !draft[index].favorite;
    }),
    pins: produce<FeatureCollection<Point, RealEstateGeoJSONProperties>>(state.pins, draft => {
      const index = draft.features.findIndex(x => x.properties.id === payload)
      if (index > -1) draft.features[index].properties.favorite = !draft.features[index].properties.favorite;
    })
  })),
  on(RealEstateActions.setRealEstatePropertyDetails, (state, { payload }) => ({
    ...state,
    selectedRealEstateProperty: payload,
    selectedRealEstatePropertyLoading: false,
  })),
  on(RealEstateActions.cancelRealEstatePropertyDetails, (state) => ({
    ...state,
    selectedRealEstateProperty: null,
    selectedRealEstatePropertyLoading: false,
    pins: produce<FeatureCollection<Point, RealEstateGeoJSONProperties>>(state.pins, draft => {
      for (let feature of draft.features) {
        feature.properties.selected = false
      }
    })
  })),
  on(RealEstateActions.errorOccurred, (state => ({
    ...state,
    itemsLoading: false,
    selectedRealEstatePropertyLoading: false,
  })))
);

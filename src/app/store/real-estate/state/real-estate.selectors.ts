import { createSelector } from '@ngrx/store';

import { AppState } from '@core/models/app-state.model';
import { REAL_ESTATES_FEATURE_KEY } from '@store/real-estate/state/real-estate.reducer';

export const selectRealEstateFeature = (state: AppState) => state[REAL_ESTATES_FEATURE_KEY];
export const selectRealEstateListItems = createSelector(selectRealEstateFeature, (state) => state.items)
export const selectRealEstateListItemsLoading = createSelector(selectRealEstateFeature, (state) => state.itemsLoading)
export const selectRealEstatePins = createSelector(selectRealEstateFeature, (state) => state.pins)
export const selectSelectedRealEstatePropertyDetails = createSelector(selectRealEstateFeature, (state) => state.selectedRealEstateProperty)
export const selectSelectedRealEstatePropertyLoading = createSelector(selectRealEstateFeature, (state) => state.selectedRealEstatePropertyLoading)

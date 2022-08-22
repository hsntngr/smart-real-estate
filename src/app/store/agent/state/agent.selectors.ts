import { createSelector } from '@ngrx/store';

import { AppState } from '@core/models/app-state.model';
import { AGENT_FEATURE_KEY } from '@store/agent/state/agent.reducer';

export const selectRealEstateFeature = (state: AppState) => state[AGENT_FEATURE_KEY];
export const selectAgentInfo = createSelector(selectRealEstateFeature, (state) => state.agent)

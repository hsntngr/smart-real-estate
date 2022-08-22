import { REAL_ESTATES_FEATURE_KEY } from '@store/real-estate/state/real-estate.reducer';
import { RealEstateState } from '@store/real-estate/models/real-estate-state.model';
import { AGENT_FEATURE_KEY } from '@store/agent/state';
import { AgentState } from '@store/agent/models';

export interface AppState {
  [REAL_ESTATES_FEATURE_KEY]: RealEstateState;
  [AGENT_FEATURE_KEY]: AgentState;
}

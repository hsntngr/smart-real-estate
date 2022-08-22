import { AGENT_FEATURE_KEY, agentReducer } from '@store/agent/state';
import { REAL_ESTATES_FEATURE_KEY, realEstateReducer } from '@store/real-estate/state';

export const NGRX_STORE_CONFIG = {
  [AGENT_FEATURE_KEY]: agentReducer,
  [REAL_ESTATES_FEATURE_KEY]: realEstateReducer
}

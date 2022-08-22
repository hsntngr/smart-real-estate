import { createReducer, on } from '@ngrx/store';

import * as AgentActions from './agent.actions';
import { AgentState } from '@store/agent/models';

export const AGENT_FEATURE_KEY = 'agent';

export const initialState: AgentState = {
  agent: null
};

export const agentReducer = createReducer<AgentState>(
  initialState,
  on(AgentActions.setAgentInfo, (state, { payload }) => ({ ...state, agent: payload })),
);


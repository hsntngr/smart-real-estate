import { createAction, props } from '@ngrx/store';

import { AgentInfo } from '@store/agent/models';


export enum RealEstateActionTypes {
  setAgentInfo = '[Agent] Set Agent',
}

export const setAgentInfo = createAction(RealEstateActionTypes.setAgentInfo, props<{ payload: AgentInfo }>());

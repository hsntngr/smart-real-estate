import { AgentInfo } from '@store/agent/models/agent-info.model';

export interface AgentState {
  agent: AgentInfo | null;
}

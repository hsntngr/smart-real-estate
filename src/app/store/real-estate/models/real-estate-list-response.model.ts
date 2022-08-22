import { RealEstateListItem } from '@store/real-estate/models/real-estate-list-item.model';
import { AgentInfo } from '@store/agent/models';

export interface RealEstateListResponse {
  agentInfo: AgentInfo;
  records: RealEstateListItem[];
  body: string;
  role: string;
  showContactInfo: boolean;
  title: string;
}

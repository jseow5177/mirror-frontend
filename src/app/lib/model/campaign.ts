export enum CampaignStatus {
    Normal = 1,
    Deleted = 2,
  }
  
  export const CampaignStatuses: Record<CampaignStatus, string> = {
    [CampaignStatus.Normal]: 'Normal',
    [CampaignStatus.Deleted]: 'Deleted',
  };
  
  export type Campaign = {
    id?: number;
    name: string;
    campaign_desc: string;
    status: CampaignStatus;
    create_time: number;
    update_time: number;
  };
  
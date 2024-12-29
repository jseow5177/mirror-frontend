import { CampaignStatus } from '../lib/model/campaign';

export type ChipColors =
  | 'success'
  | 'default'
  | 'danger'
  | 'primary'
  | 'secondary'
  | 'warning'
  | undefined;

export const campaignStatusColors: Record<CampaignStatus, ChipColors> = {
  [CampaignStatus.Pending]: 'default',
  [CampaignStatus.Running]: 'success',
  [CampaignStatus.Failed]: 'danger',
};

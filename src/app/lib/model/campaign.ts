import { z } from 'zod';
import { Email } from './email';
import { Segment } from './segment';

export enum CampaignStatus {
  Pending = 1,
  Running = 2,
  Failed = 3,
}

export const CampaignStatuses: Record<CampaignStatus, string> = {
  [CampaignStatus.Pending]: 'Pending',
  [CampaignStatus.Running]: 'Running',
  [CampaignStatus.Failed]: 'Failed',
};

export type CampaignResult = {
  total_unique_open_count: number;
  total_click_count: number;
  click_counts_by_link: Record<string, number>;
  avg_open_time: number;
};

export type CampaignEmail = {
  id?: number;
  email_id: number;
  subject: string;
  ratio: number;

  campaign_result?: CampaignResult;
  email?: Email;
};

export type Campaign = {
  id?: number;
  name: string;
  campaign_desc: string;
  status: CampaignStatus;
  campaign_emails: CampaignEmail[];
  segment_size: number;
  progress: number;
  segment_id: number;
  schedule: number;
  create_time: number;
  update_time: number;

  segment?: Segment;
};

export const CampaignEmailSchema = z.object({
  email_id: z.coerce.number({
    required_error: 'Email ID is required.',
    invalid_type_error: 'Email ID must be a number.',
  }),
  subject: z
    .string({
      required_error: 'Email subject is required.',
      invalid_type_error: 'Email subject must be a string.',
    })
    .min(1, { message: 'Email subject is required.' })
    .max(60, {
      message: 'Email subject cannot be more than 64 characters long.',
    }),
  ratio: z.coerce.number({
    required_error: 'Ratio is required.',
    invalid_type_error: 'Ratio must be a number.',
  }),
});

export const CampaignSchema = z.object({
  id: z.coerce.number({
    required_error: 'Campaign ID is required.',
    invalid_type_error: 'Campaign ID must be a number.',
  }),
  name: z
    .string({
      required_error: 'Campaign name is required.',
      invalid_type_error: 'Campaign name must be a string.',
    })
    .min(1, { message: 'Campaign name is required.' })
    .max(60, {
      message: 'Campaign name cannot be more than 64 characters long.',
    }),
  campaign_desc: z
    .string({
      required_error: 'Campaign description is required',
      invalid_type_error: 'Campaign description must be a string.',
    })
    .min(1, { message: 'Campaign description is required.' })
    .max(200, {
      message: 'Campaign description cannot be more than 120 characters long.',
    }),
  emails: z.array(CampaignEmailSchema).min(1, {
    message: 'Must have at least one email',
  }),
  segment_id: z.coerce
    .number({
      required_error: 'Segment is required.',
      invalid_type_error: 'Segment ID must be a number.',
    })
    .min(1, {
      message: 'Segment is required',
    }),
  schedule: z.coerce.number({
    required_error: 'Schedule is required.',
    invalid_type_error: 'Schedule must be a number.',
  }),
});

export const sumRatioEquals100 = (campaign: {
  emails: {
    ratio: number;
  }[];
}) => {
  return campaign.emails.reduce((sum, email) => sum + email.ratio, 0) === 100;
};

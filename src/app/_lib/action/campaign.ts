'use server';

import { revalidatePath } from 'next/cache';
import { handleAxiosError } from '../utils';
import axiosInstance from '../axios';
import { Campaign, CampaignSchema, sumRatioEquals100 } from '../model/campaign';
import { Email } from '../model/email';

export type CampaignState = {
  fieldErrors?: {
    name?: string[];
    campaign_desc?: string[];
    emails?: {
      ratio?: string[];
      email_id?: string[];
      subject?: string[];
    }[];
  };
  error?: string | null;
  message?: string | null;
  campaignID?: number | null;
};

const CreateCampaign = CampaignSchema.omit({
  id: true,
}).refine(sumRatioEquals100, {
  message: 'Ratio must add to 100%',
  path: ['emails'],
});

type CreateCampaignResponse = {
  campaign: Campaign;
};

export async function createCampaign(_: CampaignState, formData: FormData) {
  const formEmails = JSON.parse(
    formData.get('emails')?.toString() || '[]'
  ) as Email[];

  const fields = CreateCampaign.safeParse({
    name: formData.get('name'),
    campaign_desc: formData.get('campaign_desc'),
    emails: formEmails,
    segment_id: formData.get('segment_id'),
    schedule: formData.get('schedule'),
  });

  if (!fields.success) {
    const errors = fields.error.format();

    const emailErrors = Array.from({ length: formEmails.length }, (_, i) => {
      const error = errors.emails?.[`${i}`];

      if (!error || Array.isArray(error)) return {};

      return {
        subject: error.subject?._errors,
        email_id: error.email_id?._errors,
        ratio: error.ratio?._errors,
      };
    });

    return {
      fieldErrors: {
        ...fields.error.flatten().fieldErrors,
        emails: emailErrors,
      },
      error: 'Fields validation error. Failed to create campaign.',
    };
  }

  const { name, campaign_desc, emails, segment_id, schedule } = fields.data;

  try {
    const resp = await axiosInstance.post('/create_campaign', {
      name,
      campaign_desc,
      emails,
      segment_id,
      schedule: Math.ceil(schedule / 1000),
    });
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/campaigns');

    const body: CreateCampaignResponse = resp.data.body;

    return {
      campaignID: body.campaign.id,
      message: 'Campaign created',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to create campaign.');
    return {
      error: err.error,
    };
  }
}

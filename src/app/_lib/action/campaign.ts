'use server';

import { revalidatePath } from 'next/cache';
import { handleAxiosError } from '../utils';
import axiosInstance from '../axios';
import { CampaignSchema, sumRatioEquals100 } from '../model/campaign';

export type CampaignState = {
  fieldErrors?: {
    name?: string[];
    campaign_desc?: string[];
  };
  error?: string | null;
  message?: string | null;
};

const CreateCampaign = CampaignSchema.omit({
  id: true,
}).refine(sumRatioEquals100, {
  message: 'Ratio must add to 100%',
  path: ['emails'],
});

export async function createCampaign(_: CampaignState, formData: FormData) {
  const fields = CreateCampaign.safeParse({
    name: formData.get('name'),
    campaign_desc: formData.get('campaign_desc'),
    emails: JSON.parse(formData.get('emails')?.toString() || ''),
    segment_id: formData.get('segment_id'),
    schedule: formData.get('schedule'),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      error: 'Fields validation error. Failed to create campaign.',
    };
  }

  const { name, campaign_desc, emails, segment_id, schedule } = fields.data;

  try {
    await axiosInstance.post('/create_campaign', {
      name,
      campaign_desc,
      emails,
      segment_id,
    });
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/campaigns');

    return {
      message: 'Campaign created',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to create campaign.');
    return {
      error: err.error,
    };
  }
}

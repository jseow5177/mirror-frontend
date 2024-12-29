import axiosInstance from './axios';
import { handleAxiosError } from './utils';
import { Pagination } from './tag-data';
import { Campaign } from './model/campaign';

const CAMPAIGNS_PER_PAGE = 10;

type GetCampaignsResponse = {
  campaigns: Campaign[];
  pagination: Pagination;
};

export async function getCampaigns(
  currentPage?: number,
  keyword?: string
): Promise<[GetCampaignsResponse, number]> {
  try {
    const resp = await axiosInstance.post('/get_campaigns', {
      name: keyword,
      desc: keyword,
      pagination: {
        page: currentPage,
        limit: CAMPAIGNS_PER_PAGE,
      },
    });

    const body: GetCampaignsResponse = resp.data.body;

    return [body, Math.ceil((body.pagination.total || 0) / CAMPAIGNS_PER_PAGE)];
  } catch (error) {
    const err = handleAxiosError(error, 'Fail to get campaigns.');
    throw new Error(err.error);
  }
}

type GetCampaignResponse = {
  campaign: Campaign;
};

export async function getCampaign(campaignID: number): Promise<Campaign> {
  try {
    const resp = await axiosInstance.post('/get_campaign', {
      campaign_id: campaignID,
    });

    const body: GetCampaignResponse = resp.data.body;

    return body.campaign;
  } catch (error) {
    const err = handleAxiosError(error, 'Fail to get campaign.');
    throw new Error(err.error);
  }
}

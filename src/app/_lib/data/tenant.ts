'use server';

import axiosInstance from '../axios';
import { Sender, Tenant } from '../model/tenant';
import { handleAxiosError } from '../utils';

type GetTenantResponse = {
  tenant: Tenant;
};

export async function getTenant(): Promise<Tenant> {
  try {
    const resp = await axiosInstance.post('/get_tenant', {});

    const body: GetTenantResponse = resp.data.body;

    return body.tenant;
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to get tenant.');
    throw new Error(err.error);
  }
}

type GetSendersResponse = {
  senders: Sender[];
};

export async function getSenders(): Promise<Sender[]> {
  try {
    const resp = await axiosInstance.post('/get_senders', {});

    const body: GetSendersResponse = resp.data.body;
    return body.senders;
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to get senders.');
    throw new Error(err.error);
  }
}

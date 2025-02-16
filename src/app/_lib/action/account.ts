'use server';

import { cookies } from 'next/headers';
import { Session } from '../model/user';
import { cookieSetting, handleAxiosError } from '../utils';
import axiosInstance from '../axios';

export type AccountState = {
  error?: string | null;
  message?: string | null;
};

type CreateTrialAccountResponse = {
  session: Session;
};

export async function createTrialAccount(token: string): Promise<AccountState> {
  if (token === '') {
    return {
      error: 'Token is required',
    };
  }

  try {
    const cookieStore = await cookies();

    const resp = await axiosInstance.post(
      `/create_trial_account?token=${token}`
    );

    const body: CreateTrialAccountResponse = resp.data.body;

    cookieStore.set(cookieSetting.name, body.session.token, {
      ...cookieSetting.options,
      expires: new Date(body.session.expire_time * 1000),
    });

    return {
      message: 'Create trial account successful',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to create trial account.');
    return {
      error: err.error,
    };
  }
}

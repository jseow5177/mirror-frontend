'use server';

import { cookies } from 'next/headers';
import axiosInstance from '../axios';
import { LogInSchema, Session } from '../model/user';
import { handleAxiosError } from '../utils';

const cookie = {
  name: 'X-Session-ID',
  options: {
    httpOnly: true,
    secure: true,
  },
};

export type LogInState = {
  fieldErrors?: {
    tenant_name?: string[];
    username?: string[];
    password?: string[];
  };
  error?: string | null;
  message?: string | null;
};

type LogInResponse = {
  session: Session;
};

export async function logIn(_: LogInState, formData: FormData) {
  const fields = LogInSchema.safeParse({
    tenant_name: formData.get('tenant_name'),
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      message: 'Fields validation error. Failed to login.',
    };
  }

  const { tenant_name, username, password } = fields.data;

  try {
    const resp = await axiosInstance.post('/log_in', {
      tenant_name: tenant_name,
      username: username,
      password: password,
    });

    const body: LogInResponse = resp.data.body;

    cookies().set(cookie.name, body.session.token, {
      ...cookie.options,
      expires: new Date(body.session.expire_time * 1000),
    });

    return {
      message: 'Log in successful',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to log in.');
    return {
      error: err.error,
    };
  }
}

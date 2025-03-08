'use server';

import { cookies } from 'next/headers';
import axiosInstance from '../axios';
import {
  InitUserSchema,
  InviteUser,
  InviteUsersSchema,
  LogInSchema,
  Session,
} from '../model/user';
import { cookieSetting, handleAxiosError } from '../utils';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type InviteUsersState = {
  fieldErrors?: {
    users?: {
      email?: string[];
      role_id?: string[];
    }[];
  };
  error?: string | null;
  message?: string | null;
};

export async function inviteUsers(_: InviteUsersState, formData: FormData) {
  const inviteUsers = JSON.parse(
    formData.get('users')?.toString() || '[]'
  ) as InviteUser[];

  const fields = InviteUsersSchema.safeParse({
    users: inviteUsers,
  });

  if (!fields.success) {
    const errors = fields.error.format();

    const fieldErrors = Array.from({ length: inviteUsers.length }, (_, i) => {
      const error = errors.users?.[`${i}`];

      if (!error || Array.isArray(error)) return {};

      return {
        email: error.email?._errors,
        role_id: error.role_id?._errors,
      };
    });

    return {
      fieldErrors: { users: fieldErrors },
      error: 'Fields validation error. Failed to invite users.',
    };
  }

  const { users } = fields.data;

  try {
    await axiosInstance.post('/create_users', {
      users,
    });
    revalidatePath('/settings/users');

    return {
      message: 'Users created',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to create users.');
    return {
      error: err.error,
    };
  }
}

export type InitUserState = {
  fieldErrors?: {
    token?: string[];
    password?: string[];
  };
  error?: string | null;
  message?: string | null;
};

export async function initUser(_: InitUserState, formData: FormData) {
  const fields = InitUserSchema.safeParse({
    token: formData.get('token'),
    password: formData.get('password'),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      message: 'Fields validation error. Failed to init user.',
    };
  }

  const { token, password } = fields.data;

  try {
    const cookieStore = await cookies();

    const resp = await axiosInstance.post('/init_user', {
      token: token,
      password: password,
    });

    const body: LogInResponse = resp.data.body;

    cookieStore.set(cookieSetting.name, body.session.token, {
      ...cookieSetting.options,
      expires: new Date(body.session.expire_time * 1000),
    });

    return {
      message: 'Init user successful',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to init user.');
    return {
      error: err.error,
    };
  }
}

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
    const cookieStore = await cookies();

    const resp = await axiosInstance.post('/log_in', {
      tenant_name: tenant_name,
      username: username,
      password: password,
    });

    const body: LogInResponse = resp.data.body;

    cookieStore.set(cookieSetting.name, body.session.token, {
      ...cookieSetting.options,
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

export async function logOut() {
  try {
    await axiosInstance.post('/log_out', {});

    const cookieStore = await cookies();
    cookieStore.delete(cookieSetting.name);

    redirect('/');
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to log out.');
    return {
      error: err.error,
    };
  }
}

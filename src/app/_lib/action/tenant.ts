'use server';

import { revalidatePath } from 'next/cache';
import axiosInstance from '../axios';
import { DomainSchema, SenderSchema } from '../model/tenant';
import { handleAxiosError } from '../utils';

export async function verifyDomain() {
  try {
    await axiosInstance.post('/update_dns_records', {});
    revalidatePath('/dashboard/settings/email');

    return {
      message: 'Domain authenticated',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to authenticate domain.');
    return {
      error: err.error,
    };
  }
}

export type CreateSenderState = {
  fieldErrors?: {
    name?: string[];
    local_part?: string[];
  };
  error?: string | null;
  message?: string | null;
};

export async function createSender(_: CreateSenderState, formData: FormData) {
  const fields = SenderSchema.safeParse({
    name: formData.get('name'),
    local_part: formData.get('local_part'),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      message: 'Fields validation error. Failed to create sender.',
    };
  }

  const { name, local_part } = fields.data;

  try {
    await axiosInstance.post('/create_sender', {
      name: name,
      local_part: local_part,
    });
    revalidatePath('/dashboard/settings/email');

    return {
      message: 'Sender created',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to create sender.');
    return {
      error: err.error,
    };
  }
}

export type CreateDomainState = {
  fieldErrors?: {
    domain?: string[];
  };
  error?: string | null;
  message?: string | null;
};

export async function createDomain(_: CreateDomainState, formData: FormData) {
  const fields = DomainSchema.safeParse({
    domain: formData.get('domain'),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      message: 'Fields validation error. Failed to create domain.',
    };
  }

  const { domain } = fields.data;

  try {
    await axiosInstance.post('/create_domain', {
      domain: domain,
    });
    revalidatePath('/dashboard/settings/email');

    return {
      message: 'Domain created',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to create domain.');
    return {
      error: err.error,
    };
  }
}

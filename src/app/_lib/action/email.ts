'use server';

import { revalidatePath } from 'next/cache';
import { handleAxiosError } from '../utils';
import axiosInstance from '../axios';
import { EmailSchema } from '../model/email';

export type EmailState = {
  fieldErrors?: {
    name?: string[];
    email_desc?: string[];
  };
  error?: string | null;
  message?: string | null;
};

const CreateEmail = EmailSchema.omit({
  id: true,
});

export async function createEmail(_: EmailState, formData: FormData) {
  const fields = CreateEmail.safeParse({
    name: formData.get('name'),
    email_desc: formData.get('email_desc'),
    json: formData.get('json'),
    html: formData.get('html'),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      error: 'Fields validation error. Failed to create email.',
    };
  }

  const { name, email_desc, json, html } = fields.data;

  try {
    await axiosInstance.post('/create_email', {
      name,
      email_desc,
      json,
      html,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/emails');

    return {
      message: 'Email created',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to create email.');
    return {
      error: err.error,
    };
  }
}

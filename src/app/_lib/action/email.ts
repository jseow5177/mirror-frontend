'use server';

import { revalidatePath } from 'next/cache';
import { handleAxiosError } from '../utils';
import axiosInstance from '../axios';
import { Email, EmailSchema } from '../model/email';

export type EmailState = {
  fieldErrors?: {
    name?: string[];
    email_desc?: string[];
  };
  error?: string | null;
  message?: string | null;
  emailID?: number | null; // for redirect
};

const CreateEmail = EmailSchema.omit({
  id: true,
});

type CreateEmailResponse = {
  email: Email;
};

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
    const resp = await axiosInstance.post('/create_email', {
      name,
      email_desc,
      json,
      html,
    });
    revalidatePath('/dashboard/emails');

    const body: CreateEmailResponse = resp.data.body;

    return {
      emailID: body.email.id,
      message: 'Email created',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to create email.');
    return {
      error: err.error,
    };
  }
}

const UpdateEmail = EmailSchema;

type UpdateEmailResponse = {
  email: Email;
};

export async function updateEmail(_: EmailState, formData: FormData) {
  const emailID = formData.get('id');
  const fields = UpdateEmail.safeParse({
    id: emailID,
    name: formData.get('name'),
    email_desc: formData.get('email_desc'),
    json: formData.get('json'),
    html: formData.get('html'),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      error: 'Fields validation error. Failed to update email.',
    };
  }

  const { name, email_desc, json, html } = fields.data;

  try {
    const resp = await axiosInstance.post('/update_email', {
      id: Number(emailID),
      name,
      email_desc,
      json,
      html,
    });
    revalidatePath('/dashboard/emails');
    revalidatePath(`/dashboard/emails/${emailID}`);

    const body: UpdateEmailResponse = resp.data.body;

    return {
      emailID: body.email.id,
      message: 'Email updated',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to update email.');
    return {
      error: err.error,
    };
  }
}

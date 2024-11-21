'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { handleAxiosError } from './utils';
import axiosInstance from './axios';

export type EmailState = {
  fieldErrors?: {
    name?: string[];
    email_desc?: string[];
  };
  error?: string | null;
  message?: string | null;
};

const EmailSchema = z.object({
  id: z.coerce.number({
    required_error: 'Email ID is required.',
    invalid_type_error: 'Email ID must be a number.',
  }),
  name: z
    .string({
      required_error: 'Email name is required.',
      invalid_type_error: 'Email name must be a string.',
    })
    .min(1, { message: 'Email name is required.' })
    .max(60, {
      message: 'Email name cannot be more than 64 characters long.',
    }),
  email_desc: z
    .string({
      required_error: 'Email description is required',
      invalid_type_error: 'Email description must be a string.',
    })
    .min(1, { message: 'Email description is required.' })
    .max(200, {
      message: 'Email description cannot be more than 120 characters long.',
    }),
  blob: z.string({
    required_error: 'Blob is required.',
    invalid_type_error: 'Blob must be a string.',
  }),
});

const CreateEmail = EmailSchema.omit({
  id: true,
});

export async function createEmail(_: EmailState, formData: FormData) {
  console.log(formData.get('email_desc'));
  const fields = CreateEmail.safeParse({
    name: formData.get('name'),
    email_desc: formData.get('email_desc'),
    blob: formData.get('blob'),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      error: 'Fields validation error. Failed to create email.',
    };
  }

  const { name, email_desc, blob } = fields.data;

  try {
    await axiosInstance.post('/create_email', {
      name,
      email_desc,
      blob,
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

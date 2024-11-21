'use server';

import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { TagValueType } from './model/tag';
import axiosInstance from './axios';
import { handleAxiosError } from './utils';

export type TagState = {
  fieldErrors?: {
    name?: string[];
    desc?: string[];
    valueType?: string[];
  };
  error?: string | null;
  message?: string | null;
};

const TagSchema = z.object({
  id: z.coerce.number({
    required_error: 'Tag ID is required.',
    invalid_type_error: 'Tag ID must be a number.',
  }),
  name: z
    .string({
      required_error: 'Tag name is required.',
      invalid_type_error: 'Tag name must be a string.',
    })
    .min(1, { message: 'Tag name is required.' })
    .max(60, { message: 'Tag name cannot be more than 60 characters long.' }),
  desc: z
    .string({
      required_error: 'Tag description is required',
      invalid_type_error: 'Tag description must be a string.',
    })
    .min(1, { message: 'Tag description is required.' })
    .max(200, {
      message: 'Tag description cannot be more than 200 characters long.',
    }),
  valueType: z.nativeEnum(TagValueType, {
    required_error: 'Tag value type is required',
    invalid_type_error: 'Invalid tag value type.',
  }),
});

const CreateTag = TagSchema.omit({
  id: true,
});

export async function createTag(_: TagState, formData: FormData) {
  const fields = CreateTag.safeParse({
    name: formData.get('name'),
    desc: formData.get('desc'),
    valueType: Number(formData.get('valueType')),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      message: 'Fields validation error. Failed to create tag.',
    };
  }

  const { name, desc, valueType } = fields.data;

  try {
    await axiosInstance.post('/create_tag', {
      name: name,
      desc: desc,
      value_type: valueType,
    });
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/tags');

    return {
      message: 'Tag created',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to create tag.');
    return {
      error: err.error,
    };
  }
}

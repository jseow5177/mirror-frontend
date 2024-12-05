'use server';

import { revalidatePath } from 'next/cache';
import { TagSchema, TagValueType } from './model/tag';
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

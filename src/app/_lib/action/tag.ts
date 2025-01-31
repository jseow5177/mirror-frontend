'use server';

import { revalidatePath } from 'next/cache';
import { Tag, TagSchema } from '../model/tag';
import axiosInstance from '../axios';
import { handleAxiosError } from '../utils';

export type TagState = {
  fieldErrors?: {
    name?: string[];
    tag_desc?: string[];
    valueType?: string[];
  };
  error?: string | null;
  message?: string | null;
  tagID?: number | null;
};

const CreateTag = TagSchema.omit({
  id: true,
});

type CreateTagResponse = {
  tag: Tag;
};

export async function createTag(_: TagState, formData: FormData) {
  const fields = CreateTag.safeParse({
    name: formData.get('name'),
    tag_desc: formData.get('tag_desc'),
    valueType: Number(formData.get('valueType')),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      message: 'Fields validation error. Failed to create tag.',
    };
  }

  const { name, tag_desc, valueType } = fields.data;

  try {
    const resp = await axiosInstance.post('/create_tag', {
      name: name,
      tag_desc: tag_desc,
      value_type: valueType,
    });
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/tags');

    const body: CreateTagResponse = resp.data.body;

    return {
      tagID: body.tag.id,
      message: 'Tag created',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to create tag.');
    return {
      error: err.error,
    };
  }
}

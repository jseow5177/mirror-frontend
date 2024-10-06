'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { TagStatus } from './model';

export type TagState = {
  fieldErrors?: {
    tagName?: string[];
    tagDesc?: string[];
  };
  error?: string | null;
  message?: string | null;
};

const TagSchema = z.object({
  tagID: z.coerce.number({
    required_error: 'Tag ID is required.',
    invalid_type_error: 'Tag ID must be a number.',
  }),
  tagName: z
    .string({
      required_error: 'Tag name is required.',
      invalid_type_error: 'Tag name must be a string.',
    })
    .min(1, { message: 'Tag name is required.' })
    .max(64, { message: 'Tag name cannot be more than 64 characters long.' }),
  tagDesc: z
    .string({
      required_error: 'Tag description is required',
      invalid_type_error: 'Tag description must be a string.',
    })
    .min(1, { message: 'Tag description is required.' })
    .max(120, {
      message: 'Tag description cannot be more than 120 characters long.',
    }),
  tagStatus: z.nativeEnum(TagStatus, {
    invalid_type_error: 'Invalid tag status.',
  }),
  createTime: z.coerce.number(),
  updateTime: z.coerce.number(),
});

const UpdateTag = TagSchema.omit({
  tagStatus: true,
  createTime: true,
  updateTime: true,
});

export async function updateTag(_: TagState, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const fields = UpdateTag.safeParse({
    tagID: formData.get('tagID'),
    tagName: formData.get('tagName'),
    tagDesc: formData.get('tagDesc'),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      message: 'Fields validation error. Failed to update tag.',
    };
  }

  const { tagID, tagName, tagDesc } = fields.data;
  const now = Date.now();

  try {
    await sql`
      UPDATE tag_tab 
      SET tag_name = ${tagName}, tag_desc = ${tagDesc}, update_time = ${now}
      WHERE tag_id = ${tagID}
    `;
  } catch (error) {
    console.log(`updateTag err: ${error}`);

    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      message: 'Failed to update tag.',
      error: errorMessage,
    };
  }

  revalidatePath('/dashboard/tags');
  revalidatePath(`/dashboard/tags/${tagID}/edit`);
  redirect('/dashboard/tags');
}

const CreateTag = TagSchema.omit({
  tagID: true,
  tagStatus: true,
  createTime: true,
  updateTime: true,
});

export async function createTag(_: TagState, formData: FormData) {
  const fields = CreateTag.safeParse({
    tagName: formData.get('tagName'),
    tagDesc: formData.get('tagDesc'),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      message: 'Fields validation error. Failed to create tag.',
    };
  }

  const { tagName, tagDesc } = fields.data;
  const now = Date.now();

  try {
    await sql`
      INSERT INTO tag_tab (tag_name, tag_desc, tag_status, create_time, update_time)
      VALUES (${tagName}, ${tagDesc}, ${TagStatus.Normal}, ${now}, ${now})
    `;
  } catch (error) {
    console.log(`createTag err: ${error}`);

    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      error: errorMessage,
      message: 'Failed to create tag.',
    };
  }

  revalidatePath('/dashboard/tags');
  redirect('/dashboard/tags');
}

export async function deleteTag(id: number) {
  try {
    await sql`
        UPDATE tag_tab
        SET tag_status = ${TagStatus.Deleted} 
        WHERE tag_id = ${id}
    `;
    revalidatePath('/dashboard/tags');
    return { message: 'Tag deleted.' };
  } catch (error) {
    console.log(`deleteTag err: ${error}`);

    const errorMessage = error instanceof Error ? error.message : String(error);
    return { message: 'Failed to delete tag.', error: errorMessage };
  }
}

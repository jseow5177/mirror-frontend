'use server';

import { revalidatePath } from 'next/cache';
import axiosInstance from './axios';
import { handleAxiosError } from './utils';
import { SegmentSchema } from './model/segment';

export type SegmentState = {
  fieldErrors?: {
    name?: string[];
    desc?: string[];
  };
  error?: string | null;
  message?: string | null;
};

const CreateSegment = SegmentSchema.omit({
  id: true,
});

export async function createSegment(_: SegmentState, formData: FormData) {
  const fields = CreateSegment.safeParse({
    name: formData.get('name'),
    desc: formData.get('desc'),
    criteria: formData.get('criteria'),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      error: 'Fields validation error. Failed to create segment.',
    };
  }

  const { name, desc, criteria } = fields.data;

  try {
    await axiosInstance.post('/create_segment', {
      name,
      desc,
      criteria: JSON.parse(criteria),
    });
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/segments');

    return {
      message: 'Segment created',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to create segment.');
    return {
      error: err.error,
    };
  }
}

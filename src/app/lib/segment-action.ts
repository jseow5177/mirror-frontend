'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import axiosInstance from './axios';
import { handleAxiosError, validateCriteria } from './utils';

export type SegmentState = {
  fieldErrors?: {
    name?: string[];
    desc?: string[];
    criteria?: string[];
  };
  error?: string | null;
  message?: string | null;
};

const SegmentSchema = z.object({
  id: z.coerce.number({
    required_error: 'Segment ID is required.',
    invalid_type_error: 'Segment ID must be a number.',
  }),
  name: z
    .string({
      required_error: 'Segment name is required.',
      invalid_type_error: 'Segment name must be a string.',
    })
    .min(1, { message: 'Segment name is required.' })
    .max(60, {
      message: 'Segment name cannot be more than 64 characters long.',
    }),
  desc: z
    .string({
      required_error: 'Segment description is required',
      invalid_type_error: 'Segment description must be a string.',
    })
    .min(1, { message: 'Segment description is required.' })
    .max(200, {
      message: 'Segment description cannot be more than 120 characters long.',
    }),
  criteria: z
    .string({
      required_error: 'Criteria is required.',
      invalid_type_error: 'Criteria must be a string.',
    })
    .refine((data) => validateCriteria(JSON.parse(data)), {
      message: 'Invalid criteria.',
    }),
});

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

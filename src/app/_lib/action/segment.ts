'use server';

import { revalidatePath } from 'next/cache';
import axiosInstance from '../axios';
import { handleAxiosError } from '../utils';
import { Segment, SegmentSchema } from '../model/segment';

export type SegmentState = {
  fieldErrors?: {
    name?: string[];
    segment_desc?: string[];
  };
  error?: string | null;
  message?: string | null;
  segmentID?: number | null;
};

const CreateSegment = SegmentSchema.omit({
  id: true,
});

type CreateSegmentResponse = {
  segment: Segment;
};

export async function createSegment(_: SegmentState, formData: FormData) {
  const fields = CreateSegment.safeParse({
    name: formData.get('name'),
    segment_desc: formData.get('segment_desc'),
    criteria: formData.get('criteria'),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      error: 'Fields validation error. Failed to create segment.',
    };
  }

  const { name, segment_desc, criteria } = fields.data;

  try {
    const resp = await axiosInstance.post('/create_segment', {
      name,
      segment_desc,
      criteria: JSON.parse(criteria),
    });
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/segments');

    const body: CreateSegmentResponse = resp.data.body;

    return {
      segmentID: body.segment.id,
      message: 'Segment created',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to create segment.');
    return {
      error: err.error,
    };
  }
}

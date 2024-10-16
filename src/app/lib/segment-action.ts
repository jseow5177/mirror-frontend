'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { SegmentStatus } from './model';

export type SegmentState = {
  fieldErrors?: {
    segmentName?: string[];
    segmentDesc?: string[];
    criteria?: string[];
  };
  error?: string | null;
  message?: string | null;
  payload?: FormData | null;
};

const SegmentSchema = z.object({
  segmentID: z.coerce.number({
    required_error: 'Segment ID is required.',
    invalid_type_error: 'Segment ID must be a number.',
  }),
  segmentName: z
    .string({
      required_error: 'Segment name is required.',
      invalid_type_error: 'Segment name must be a string.',
    })
    .min(1, { message: 'Segment name is required.' })
    .max(64, {
      message: 'Segment name cannot be more than 64 characters long.',
    }),
  segmentDesc: z
    .string({
      required_error: 'Segment description is required',
      invalid_type_error: 'Segment description must be a string.',
    })
    .min(1, { message: 'Segment description is required.' })
    .max(120, {
      message: 'Segment description cannot be more than 120 characters long.',
    }),
  segmentStatus: z
    .nativeEnum(SegmentStatus, {
      invalid_type_error: 'Invalid segment status.',
    })
    .optional(),
  criteria: z
    .string({
      required_error: 'Criteria is required.',
      invalid_type_error: 'Criteria must be a string.',
    })
    .refine((data) => validateCriteria(data), {
      message: 'Invalid criteria.',
    }),
  createTime: z.coerce.number(),
  updateTime: z.coerce.number(),
});

const UpdateSegment = SegmentSchema.omit({
  segmentStatus: true,
  createTime: true,
  updateTime: true,
});

export async function updateSegment(_: SegmentState, formData: FormData) {
  const fields = UpdateSegment.safeParse({
    segmentID: formData.get('segmentID'),
    segmentName: formData.get('segmentName'),
    segmentDesc: formData.get('segmentDesc'),
    criteria: formData.get('criteria'),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      message: 'Fields validation error. Failed to update segment.',
      payload: formData,
    };
  }

  const { segmentID, segmentName, segmentDesc, criteria } = fields.data;
  const now = Date.now();

  try {
    await sql`
        UPDATE segment_tab 
        SET tag_name = ${segmentName}, tag_desc = ${segmentDesc}, criteria = ${criteria}, update_time = ${now}
        WHERE tag_id = ${segmentID}
      `;

    revalidatePath('/dashboard/segments');
    revalidatePath(`/dashboard/segments/${segmentID}/edit`);
    revalidatePath(`/dashboard/segments/${segmentID}`);

    return {
      message: 'Segment updated',
    };
  } catch (error) {
    console.log(`updateSegment err: ${error}`);

    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      message: 'Failed to update segment.',
      error: errorMessage,
    };
  }
}

const CreateSegment = SegmentSchema.omit({
  segmentID: true,
  segmentStatus: true,
  createTime: true,
  updateTime: true,
});

export async function createSegment(_: SegmentState, formData: FormData) {
  const fields = CreateSegment.safeParse({
    segmentName: formData.get('segmentName'),
    segmentDesc: formData.get('segmentDesc'),
    criteria: formData.get('criteria'),
  });

  if (!fields.success) {
    return {
      fieldErrors: fields.error.flatten().fieldErrors,
      message: 'Fields validation error. Failed to create segment.',
      payload: formData,
    };
  }

  const { segmentName, segmentDesc, criteria } = fields.data;
  const now = Date.now();

  try {
    await sql`
        INSERT INTO segment_tab (segment_name, segment_desc, segment_status, criteria, create_time, update_time)
        VALUES (${segmentName}, ${segmentDesc}, ${SegmentStatus.Normal}, ${criteria}, ${now}, ${now})
      `;

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/segments');

    return {
      message: 'Segment created',
    };
  } catch (error) {
    console.log(`createSegment err: ${error}`);

    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      error: errorMessage,
      message: 'Failed to create segment.',
    };
  }
}

export async function deleteSegment(id: number) {
  try {
    await sql`
          UPDATE segment_tab
          SET segment_status = ${SegmentStatus.Deleted} 
          WHERE segment_id = ${id}
      `;
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/segments');
    return { message: 'Segment deleted.' };
  } catch (error) {
    console.log(`deleteSegment err: ${error}`);

    const errorMessage = error instanceof Error ? error.message : String(error);
    return { message: 'Failed to delete segment.', error: errorMessage };
  }
}

// Just simple validation to make sure it is not empty
function validateCriteria(c: string): boolean {
  const criteria = JSON.parse(c);

  if (!Array.isArray(criteria.queries) || criteria.queries.length === 0) {
    console.log('criteria has empty queries');
    return false;
  }

  for (const query of criteria.queries) {
    if (!query.lookup.tagID || !query.lookup.op || !query.lookup.value) {
      console.log('query fields are incomplete');
      return false;
    }
  }

  return true;
}

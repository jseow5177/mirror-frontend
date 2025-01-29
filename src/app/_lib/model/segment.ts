import { z } from 'zod';
import { validateCriteria } from '../utils';

export type LRange = {
  lte?: string;
  lt?: string;
  gte?: string;
  gt?: string;
};

export type Lookup = {
  tag_id?: number;
  eq?: string;
  in?: string[];
  range?: LRange;
};

export type Query = {
  lookups: Lookup[];
  op: string;
};

export type Criteria = {
  queries: Query[];
  op: string;
};

export enum SegmentStatus {
  Normal = 1,
  Deleted = 2,
}

export const SegmentStatuses: Record<SegmentStatus, string> = {
  [SegmentStatus.Normal]: 'Normal',
  [SegmentStatus.Deleted]: 'Deleted',
};

export type Segment = {
  id?: number;
  name: string;
  segment_desc: string;
  status: SegmentStatus;
  criteria: Criteria;
  create_time: number;
  update_time: number;
};

export const SegmentSchema = z.object({
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
  segment_desc: z
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

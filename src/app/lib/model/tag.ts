import { z } from 'zod';

export enum TagStatus {
  Normal = 1,
  Deleted = 2,
}

export const TagStatuses: Record<TagStatus, string> = {
  [TagStatus.Normal]: 'Normal',
  [TagStatus.Deleted]: 'Deleted',
};

export enum TagValueType {
  Int = 1,
  Str = 2,
  Float = 3,
}

export const TagValueTypes: Record<TagValueType, string> = {
  [TagValueType.Int]: 'Number',
  [TagValueType.Str]: 'Text',
  [TagValueType.Float]: 'Decimal',
};

export type Tag = {
  id?: number;
  name: string;
  desc: string;
  status: TagStatus;
  value_type: TagValueType;
  create_time: number;
  update_time: number;
};

export const isTagNumeric = (tag: Tag) => {
  return (
    tag.value_type === TagValueType.Int || tag.value_type === TagValueType.Float
  );
};

export const TagSchema = z.object({
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

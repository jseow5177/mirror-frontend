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

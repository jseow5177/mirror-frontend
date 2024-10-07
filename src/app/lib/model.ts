export enum TagStatus {
  Normal = 1,
  Pending = 2,
  Deleted = 3,
}

export enum TagValueType {
  Int = 1,
  Str = 2,
  Float = 3,
}

export const tagValueTypes: Record<TagValueType, String> = {
  [TagValueType.Int]: 'Number',
  [TagValueType.Str]: 'Text',
  [TagValueType.Float]: 'Decimal',
};

export type Tag = {
  tag_id: number;
  tag_name: string;
  tag_desc: string;
  tag_status: TagStatus;
  tag_value_type: TagValueType;
  create_time: number;
  update_time: number;
};

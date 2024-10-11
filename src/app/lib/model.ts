export enum TagStatus {
  Normal = 1,
  Deleted = 2,
}

export enum TagValueType {
  Int = 1,
  Str = 2,
  Float = 3,
}

export const TagValueTypes: Record<TagValueType, String> = {
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

export enum TaskStatus {
  Pending = 1,
  Running = 2,
  Failed = 3,
  Success = 4,
}

export type Task = {
  task_id: number;
  tag_id: number;
  task_status: number;
  file_url: string;
  create_time: number;
  update_time: number;
};

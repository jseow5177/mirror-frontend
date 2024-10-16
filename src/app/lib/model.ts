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
  tag_id?: number;
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

export const TaskStatuses: Record<TaskStatus, string> = {
  [TaskStatus.Pending]: 'Pending',
  [TaskStatus.Running]: 'Running',
  [TaskStatus.Failed]: 'Failed',
  [TaskStatus.Success]: 'Success',
};

export type Task = {
  task_id: number;
  tag_id: number;
  file_url: string;
  task_status: TaskStatus;
  error_msg: string;
  create_time: number;
  update_time: number;
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
  segment_id: number;
  segment_name: string;
  segment_desc: string;
  segment_status: SegmentStatus;
  criteria: string;
  create_time: number;
  update_time: number;
};

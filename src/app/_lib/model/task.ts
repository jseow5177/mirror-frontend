export enum TaskStatus {
  Pending = 1,
  Running = 2,
  Success = 3,
  Failed = 4,
}

export const TaskStatuses: Record<TaskStatus, string> = {
  [TaskStatus.Pending]: 'Pending',
  [TaskStatus.Running]: 'Running',
  [TaskStatus.Success]: 'Success',
  [TaskStatus.Failed]: 'Failed',
};

export enum TaskType {
  FileUpload = 1,
}

export enum ResourceType {
  Tag = 1,
}

export type TaskExtInfo = {
  progress?: number;
  size?: number;
  ori_file_name?: number;
};

export type Task = {
  id: number;
  resource_id: number;
  status: TaskStatus;
  task_type: TaskType;
  resource_type: ResourceType;
  ext_info: TaskExtInfo;
  create_time: number;
  update_time: number;
};

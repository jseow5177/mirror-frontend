'use server';

import { ResourceType, Task } from '../model/task';
import axiosInstance from '../axios';
import { handleAxiosError } from '../utils';
import { Pagination } from './tag';

type GetFileUploadTasksResponse = {
  tasks: Task[];
  pagination: Pagination;
};

const TASKS_PER_PAGE = 10;

export async function getTagFileUploadTasks(
  tagID: number,
  currentPage?: number
): Promise<[GetFileUploadTasksResponse, number]> {
  try {
    const resp = await axiosInstance.post('/get_file_upload_tasks', {
      resource_id: tagID,
      resource_type: ResourceType.Tag,
      pagination: {
        page: currentPage,
        limit: TASKS_PER_PAGE,
      },
    });

    const body: GetFileUploadTasksResponse = resp.data.body;

    return [body, Math.ceil((body.pagination.total || 0) / TASKS_PER_PAGE)];
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to get tasks.');
    throw new Error(err.error);
  }
}

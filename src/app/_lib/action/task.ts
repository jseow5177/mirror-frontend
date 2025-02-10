'use server';

import axiosInstance from '../axios';
import { handleAxiosError } from '../utils';

export type TaskState = {
  fieldErrors?: {
    file?: string[];
  };
  error?: string | null;
  message?: string | null;
};

export async function createFileUploadTask(
  _: TaskState,
  formData: FormData
): Promise<TaskState> {
  try {
    await axiosInstance.post(
      `/create_file_upload_task?resource_id=${formData.get('resource_id')}&resource_type=${1}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return {
      message: 'File uploaded',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to upload tag data.');
    return {
      error: err.error,
    };
  }
}

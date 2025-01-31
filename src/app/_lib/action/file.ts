'use server';

import axiosInstance from '../axios';
import { Tag } from '../model/tag';
import { handleAxiosError } from '../utils';

export type FileState = {
  error?: string | null;
  message?: string | null;
};

export async function uploadFile(tag: Tag, file: File): Promise<FileState> {
  try {
    await axiosInstance.post('/TODO', {
      body: file,
    });

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

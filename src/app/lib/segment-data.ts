import axiosInstance from './axios';
import axios from 'axios';
import { Segment } from './model/segment';
import { Criteria } from './model/segment';
import { handleAxiosError } from './utils';
import { Pagination } from './tag-data';

type PreviewUdResponse = {
  count: number;
};

type GetSegmentsResponse = {
  segments: Segment[];
  pagination: Pagination;
};

type CountSegmentsResponse = {
  count: number;
};

const SEGMENTS_PER_PAGE = 10;

export async function previewUd(criteria: Criteria, signal?: AbortSignal) {
  try {
    const resp = await axiosInstance.post(
      '/preview_ud',
      {
        criteria: criteria,
      },
      {
        signal: signal,
      }
    );

    const body: PreviewUdResponse = resp.data.body;

    return body.count;
  } catch (error) {
    if (!axios.isCancel(error)) {
      const err = handleAxiosError(error, 'Failed to preview segment count.');
      throw new Error(err.error);
    }
    return -1;
  }
}

export async function getSegment(id: number) {
  try {
    return null;
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to get segment.');
    throw new Error(err.error);
  }
}

export async function getSegments(
  currentPage?: number,
  keyword?: string
): Promise<[GetSegmentsResponse, number]> {
  try {
    const resp = await axiosInstance.post('/get_segments', {
      name: keyword,
      desc: keyword,
      pagination: {
        page: currentPage,
        limit: SEGMENTS_PER_PAGE,
      },
    });

    const body: GetSegmentsResponse = resp.data.body;

    return [body, Math.ceil((body.pagination.total || 0) / SEGMENTS_PER_PAGE)];
  } catch (error) {
    const err = handleAxiosError(error, 'Fail to get segments.');
    throw new Error(err.error);
  }
}

export async function countTotalSegments() {
  try {
    const resp = await axiosInstance.post('/count_segments', {});

    const body: CountSegmentsResponse = resp.data.body;

    return body.count;
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to count total segments.');
    throw new Error(err.error);
  }
}

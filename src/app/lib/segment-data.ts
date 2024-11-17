import axiosInstance from './axios';
import axios from 'axios';
import { Segment } from './model';
import { Criteria } from './model/segment';

type Pagination = {
  page?: number;
  limit?: number;
  has_next?: boolean;
  total?: number;
};

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

const ITEMS_PER_PAGE = 5;

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
      console.error('previewUd err:', error);
      throw new Error('Failed to preview segment count.');
    }
    return -1;
  }
}

export async function getSegment(id: number) {
  try {
    return null;
  } catch (error) {
    console.error('getSegment database error:', error);
    throw new Error('Failed to get segment.');
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
        limit: ITEMS_PER_PAGE,
      },
    });

    const body: GetSegmentsResponse = resp.data.body;

    return [body, Math.ceil((body.pagination.total || 0) / ITEMS_PER_PAGE)];
  } catch (error) {
    console.error('getSegments err:', error);
    throw new Error('Failed to get segments.');
  }
}

export async function countTotalSegments() {
  try {
    const resp = await axiosInstance.post('/count_segments', {});

    const body: CountSegmentsResponse = resp.data.body;

    return body.count;
  } catch (error) {
    console.error('countTotalSegments database error:', error);
    throw new Error('Failed to count total segments.');
  }
}



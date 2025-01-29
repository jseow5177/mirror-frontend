'use server';

import axiosInstance from '../axios';
import axios from 'axios';
import { Segment } from '../model/segment';
import { Criteria } from '../model/segment';
import { handleAxiosError } from '../utils';
import { Pagination } from './tag';

const SEGMENTS_PER_PAGE = 10;

type PreviewUdResponse = {
  count: number;
};

export async function countUd(segmentID: number) {
  try {
    const resp = await axiosInstance.post('/count_ud', {
      segment_id: segmentID,
    });

    const body: PreviewUdResponse = resp.data.body;

    return body.count;
  } catch (error) {
    if (!axios.isCancel(error)) {
      const err = handleAxiosError(error, 'Failed to count segment size.');
      throw new Error(err.error);
    }
    return -1;
  }
}

export async function previewUd(criteria: Criteria) {
  console.log('preview');
  try {
    const resp = await axiosInstance.post(
      '/preview_ud',
      {
        criteria: criteria,
      }
      // {
      //   signal: signal,
      // }
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

type GetSegmentResponse = {
  segment: Segment;
};

export async function getSegment(segmentID: number) {
  try {
    const resp = await axiosInstance.post('/get_segment', {
      segment_id: segmentID,
    });

    const body: GetSegmentResponse = resp.data.body;

    return body.segment;
  } catch (error) {
    const err = handleAxiosError(error, 'Fail to get segment.');
    throw new Error(err.error);
  }
}

type GetSegmentsResponse = {
  segments: Segment[];
  pagination: Pagination;
};

export async function getSegments(
  currentPage?: number,
  keyword?: string
): Promise<[GetSegmentsResponse, number]> {
  try {
    const resp = await axiosInstance.post('/get_segments', {
      keyword: keyword,
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

type CountSegmentsResponse = {
  count: number;
};

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

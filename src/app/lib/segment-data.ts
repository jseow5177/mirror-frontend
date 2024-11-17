import axiosInstance from './axios';
import axios from 'axios';
import { validateCriteria } from './utils';

type PreviewUdResponse = {
  count: number;
};

export async function previewUd(criteria: string, signal?: AbortSignal) {
  try {
    const resp = await axiosInstance.post(
      '/preview_ud',
      {
        criteria: JSON.parse(criteria),
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

export async function getSegments(query: string, currentPage: number) {
  try {
    return [];
  } catch (error) {
    console.error('getSegments database error:', error);
    throw new Error('Failed to get segments.');
  }
}

export async function countSegmentsPages(query: string) {
  try {
    return 0;
  } catch (error) {
    console.error('countSegmentsPages database error:', error);
    throw new Error('Failed to count segments.');
  }
}

export async function countTotalSegments() {
  try {
    return 0;
  } catch (error) {
    console.error('countTotalSegments database error:', error);
    throw new Error('Failed to count total segments.');
  }
}

export async function getCriteriaCount(criteria: string) {
  try {
    return 0;
  } catch (error) {
    console.error('getCriteriaCount database error:', error);
    throw new Error('Failed to get criteria count.');
  }
}

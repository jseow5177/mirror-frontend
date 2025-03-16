'use server';

import { Tag } from '../model/tag';
import axiosInstance from '../axios';
import { handleAxiosError } from '../utils';

export type Pagination = {
  page?: number;
  limit?: number;
  has_next?: boolean;
  total?: number;
};

type GetTagResponse = {
  tag: Tag;
};

type GetTagsResponse = {
  tags: Tag[];
  pagination: Pagination;
};

type CountTagsResponse = {
  count: number;
};

type GetDistinctTagValuesResponse = {
  tag_values: string[];
};

const TAGS_PER_PAGE = 10;

export async function getDistinctTagValues(id: number) {
  try {
    const resp = await axiosInstance.post('/get_distinct_tag_values', {
      tag_id: id,
    });

    const body: GetDistinctTagValuesResponse = resp.data.body;

    return body.tag_values;
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to get distinct tag values.');
    throw new Error(err.error);
  }
}

export async function getTag(id: number) {
  try {
    const resp = await axiosInstance.post('/get_tag', {
      tag_id: id,
    });

    const body: GetTagResponse = resp.data.body;

    return body.tag;
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to get tag.');
    throw new Error(err.error);
  }
}

export async function countTotalTags() {
  try {
    const resp = await axiosInstance.post('/count_tags', {});

    const body: CountTagsResponse = resp.data.body;

    return body.count;
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to count total tags.');
    throw new Error(err.error);
  }
}

export async function getTags(
  currentPage?: number,
  keyword?: string
): Promise<[GetTagsResponse, number]> {
  try {
    const resp = await axiosInstance.post('/get_tags', {
      keyword: keyword,
      pagination: {
        page: currentPage,
        limit: TAGS_PER_PAGE,
      },
    });

    const body: GetTagsResponse = resp.data.body;

    return [body, Math.ceil((body.pagination.total || 0) / TAGS_PER_PAGE)];
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to get tags.');
    throw new Error(err.error);
  }
}

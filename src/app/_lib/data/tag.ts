import { sql } from '@vercel/postgres';
import { Task } from '../model';
import { Tag, TagStatus } from '../model/tag';
import axiosInstance from '../axios';
import { handleAxiosError } from '../utils';

export type Pagination = {
  page?: number;
  limit?: number;
  has_next?: boolean;
  total?: number;
};

type GetTagsResponse = {
  tags: Tag[];
  pagination: Pagination;
};

type CountTagsResponse = {
  count: number;
};

const TAGS_PER_PAGE = 10;

export async function getTag(id: number) {
  try {
    const data = await sql<Tag>`
        SELECT *
        FROM tag_tab
        WHERE tag_id = ${id} AND tag_status = ${TagStatus.Normal}
    `;

    const tag = data.rows[0];

    if (tag) {
      return {
        ...tag,
        create_time: Number(tag?.create_time),
        update_time: Number(tag?.update_time),
      };
    }
    return null;
  } catch (error) {
    console.error('getTag database error:', error);
    throw new Error('Failed to get tag.');
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
      name: keyword,
      desc: keyword,
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

export async function getTasks(tagID: number, currentPage: number) {
  const offset = (currentPage - 1) * TAGS_PER_PAGE;

  try {
    const data = await sql<Task>`
            SELECT *
            FROM task_tab
            WHERE tag_id = ${tagID}
            ORDER BY create_time DESC
            LIMIT ${TAGS_PER_PAGE} OFFSET ${offset}
        `;

    const tasks = data.rows.map((task) => ({
      ...task,
      create_time: Number(task.create_time),
      update_time: Number(task.update_time),
    }));

    return tasks;
  } catch (error) {
    console.error('getTasks database error:', error);
    throw new Error('Failed to get tasks.');
  }
}

export async function countTasksPages(tagID: number) {
  try {
    const count = await sql`
            SELECT
                COUNT(*)
            FROM task_tab
            WHERE tag_id = ${tagID}
        `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / TAGS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('countTasksPages database error:', error);
    throw new Error('Failed to count tasks.');
  }
}

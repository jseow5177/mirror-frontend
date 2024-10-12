import { sql } from '@vercel/postgres';
import { Tag, TagStatus, Task } from './model';

// await new Promise((resolve) => setTimeout(resolve, 1000));

const ITEMS_PER_PAGE = 5;

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
    console.error('getTags database error:', error);
    throw new Error('Failed to get tags.');
  }
}

export async function getTags(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<Tag>`
            SELECT *
            FROM tag_tab
            WHERE (
                tag_name ILIKE ${`%${query}%`} OR
                tag_desc ILIKE ${`%${query}%`}
            ) AND tag_status != ${TagStatus.Deleted}
            ORDER BY update_time DESC
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;

    const tags = data.rows.map((tag) => ({
      ...tag,
      create_time: Number(tag.create_time),
      update_time: Number(tag.update_time),
    }));

    return tags;
  } catch (error) {
    console.error('getTags database error:', error);
    throw new Error('Failed to get tags.');
  }
}

export async function getTasks(tagID: number, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<Task>`
            SELECT *
            FROM task_tab
            WHERE tag_id = ${tagID}
            ORDER BY create_time DESC
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
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

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('countTasksPages database error:', error);
    throw new Error('Failed to count tasks.');
  }
}

export async function countTagsPages(query: string) {
  try {
    const count = await sql`
            SELECT
                COUNT(*)
            FROM tag_tab
            WHERE
                (
                    tag_name ILIKE ${`%${query}%`} OR
                    tag_desc ILIKE ${`%${query}%`}
                ) 
                    AND tag_status = ${TagStatus.Normal}
        `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('countTagsPages database error:', error);
    throw new Error('Failed to count tags.');
  }
}

export async function countTotalTags() {
  try {
    const count = await sql`
            SELECT
                COUNT(*)
            FROM tag_tab
            WHERE tag_status = ${TagStatus.Normal}
        `;

    return Number(count.rows[0].count);
  } catch (error) {
    console.error('countTotalTags database error:', error);
    throw new Error('Failed to count total tags.');
  }
}

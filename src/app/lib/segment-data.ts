import { sql } from '@vercel/postgres';
import { Segment, SegmentStatus } from './model';

// await new Promise((resolve) => setTimeout(resolve, 1000));

const ITEMS_PER_PAGE = 5;

export async function getSegment(id: number) {
  try {
    const data = await sql<Segment>`
        SELECT *
        FROM segment_tab
        WHERE segment_id = ${id} AND segment_status = ${SegmentStatus.Normal}
    `;

    const segment = data.rows[0];

    if (segment) {
      return {
        ...segment,
        create_time: Number(segment?.create_time),
        update_time: Number(segment?.update_time),
      };
    }
    return null;
  } catch (error) {
    console.error('getSegment database error:', error);
    throw new Error('Failed to get segment.');
  }
}

export async function getSegments(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<Segment>`
            SELECT *
            FROM segment_tab
            WHERE (
                segment_name ILIKE ${`%${query}%`} OR
                segment_desc ILIKE ${`%${query}%`}
            ) AND segment_status != ${SegmentStatus.Deleted}
            ORDER BY update_time DESC
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;

    const segments = data.rows.map((segment) => ({
      ...segment,
      create_time: Number(segment.create_time),
      update_time: Number(segment.update_time),
    }));

    return segments;
  } catch (error) {
    console.error('getSegments database error:', error);
    throw new Error('Failed to get segments.');
  }
}

export async function countSegmentsPages(query: string) {
  try {
    const count = await sql`
            SELECT
                COUNT(*)
            FROM segment_tab
            WHERE
                (
                    segment_name ILIKE ${`%${query}%`} OR
                    segment_desc ILIKE ${`%${query}%`}
                ) 
                    AND segment_status = ${SegmentStatus.Normal}
        `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('countSegmentsPages database error:', error);
    throw new Error('Failed to count segments.');
  }
}

export async function countTotalSegments() {
  try {
    const count = await sql`
            SELECT
                COUNT(*)
            FROM segment_tab
            WHERE segment_status = ${SegmentStatus.Normal}
        `;

    return Number(count.rows[0].count);
  } catch (error) {
    console.error('countTotalSegments database error:', error);
    throw new Error('Failed to count total segments.');
  }
}

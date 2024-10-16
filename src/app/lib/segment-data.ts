//import { sql } from '@vercel/postgres';
import { Segment, SegmentStatus, TagValueType } from './model';
import pg from 'pg';
import { getTag } from './tag-data';

const { Pool, escapeLiteral } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// await new Promise((resolve) => setTimeout(resolve, 1000));

const ITEMS_PER_PAGE = 5;

export async function getSegment(id: number) {
  try {
    const data = await pool.query<Segment>(`
        SELECT *
        FROM segment_tab
        WHERE segment_id = ${id} AND segment_status = ${SegmentStatus.Normal}
    `);

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
    const data = await pool.query<Segment>(`
            SELECT *
            FROM segment_tab
            WHERE (
                segment_name ILIKE ${escapeLiteral(`%${query}%`)} OR
                segment_desc ILIKE ${escapeLiteral(`%${query}%`)}
            ) AND segment_status != ${SegmentStatus.Deleted}
            ORDER BY update_time DESC
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `);

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
    const count = await pool.query(`
            SELECT
                COUNT(*)
            FROM segment_tab
            WHERE
                (
                    segment_name ILIKE ${escapeLiteral(`%${query}%`)} OR
                    segment_desc ILIKE ${escapeLiteral(`%${query}%`)}
                ) 
                    AND segment_status = ${SegmentStatus.Normal}
        `);

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('countSegmentsPages database error:', error);
    throw new Error('Failed to count segments.');
  }
}

export async function countTotalSegments() {
  try {
    const count = await pool.query(`
            SELECT
                COUNT(*)
            FROM segment_tab
            WHERE segment_status = ${SegmentStatus.Normal}
        `);

    return Number(count.rows[0].count);
  } catch (error) {
    console.error('countTotalSegments database error:', error);
    throw new Error('Failed to count total segments.');
  }
}

export async function getCriteriaCount(criteria: string) {
  try {
    const whereCond = await constructSQL(parseCriteria(criteria));

    const count = await pool.query(`
      SELECT
        COUNT(*)
      FROM ud_tag_tab
      WHERE ${whereCond}
    `);


    return Number(count.rows[0].count);
  } catch (error) {
    console.error('getCriteriaCount database error:', error);
    throw new Error('Failed to get criteria count.');
  }
}

async function constructSQL(queries: Array<any>) {
  if (queries.length === 0) {
    return '';
  }

  let sql = '';
  for (const query of queries) {
    const lookup = query.lookup
    const tag = await getTag(lookup.tagID);
    let valueCond = '';

    if (tag?.tag_value_type === TagValueType.Str) {
      valueCond = `tag_val_str ${lookup.op} '${lookup.value}'`;
    } else if (tag?.tag_value_type === TagValueType.Int) {
      valueCond = `tag_val_int ${lookup.op} ${lookup.value}`;
    } else if (tag?.tag_value_type === TagValueType.Float) {
      valueCond = `tag_val_float ${lookup.op} ${lookup.value}`;
    }

    if (query.prevOp) {
      sql += query.prevOp
    }

    sql += ` (tag_id = ${lookup.tagID} AND ${valueCond}) `;
  }

  return sql;
}

function parseCriteria(criteria: string) {
  const js = JSON.parse(criteria);

  if (!Array.isArray(js.queries)) {
    return [];
  }

  const parsedData = {
    queries: js.queries.map((query: any) => {
      return {
        lookup: {
          tagID: query.lookup.tagID,
          op: query.lookup.op,
          value: query.lookup.value,
        },
        prevOp: query.prevOp,
      };
    }),
  };

  return parsedData.queries;
}

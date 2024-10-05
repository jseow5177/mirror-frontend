import { sql } from "@vercel/postgres";
import { Tag, TagStatus } from "./model";

const ITEMS_PER_PAGE = 10

export async function getTag(id: number) {
    try {
        const data = await sql<Tag>`
            SELECT
                tag_id,
                tag_name,
                tag_desc,
                tag_status,
                create_time,
                update_time
            FROM tag_tab
            WHERE tag_id = ${id} AND tag_status != ${TagStatus.Deleted}
        `

        const tag = data.rows[0]

        return {
            ...tag,
            create_time: Number(tag.create_time),
            update_time: Number(tag.update_time), 
        }
    } catch (error){
        console.error('getTags database error:', error);
        throw new Error('Failed to get tags.');
    }
}

export async function getTags(query: string, currentPage: number) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const data = await sql<Tag>`
            SELECT
                tag_id,
                tag_name,
                tag_desc,
                tag_status,
                create_time,
                update_time
            FROM tag_tab
            WHERE (
                tag_name ILIKE ${`%${query}%`} OR
                tag_desc ILIKE ${`%${query}%`}
            ) AND tag_status != ${TagStatus.Deleted}
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `

        const tags = data.rows.map(tag => ({
            ...tag,
            create_time: Number(tag.create_time),
            update_time: Number(tag.update_time),   
        }))

        return tags
    } catch (error){
        console.error('getTags database error:', error);
        throw new Error('Failed to get tags.');
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
        `

        const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error){
        console.error('countTagsPages database error:', error);
        throw new Error('Failed to count tags.');
    }
}


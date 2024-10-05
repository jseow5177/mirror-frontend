'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { TagStatus } from './model';

export async function deleteTag(id: number) {
    try {
        await sql`
            UPDAT tag_tab
            SET tag_status = ${TagStatus.Deleted} 
            WHERE tag_id = ${id}
        `;
        revalidatePath('/dashboard/tags');
        return { message: 'Tag deleted.' };
      } catch (error) {
        console.log(`deleteTag err: ${error}`)

        const errorMessage = error instanceof Error ? error.message : String(error);
        return { message: 'Failed to delete tag.', error: errorMessage };
      }
}
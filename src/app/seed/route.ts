import { db } from '@vercel/postgres';
import { tags } from '../lib/mock-data';

const client = await db.connect();

async function seedTags() {
  await client.sql`
        DROP TABLE tag_tab;
    `;
  await client.sql`
        CREATE TABLE IF NOT EXISTS tag_tab (
            tag_id BIGSERIAL PRIMARY KEY,
            tag_name VARCHAR(64) NOT NULL,
            tag_desc VARCHAR(120) NOT NULL DEFAULT '',
            tag_value_type INTEGER NOT NULL,
            tag_status INTEGER NOT NULL,
            create_time BIGINT NOT NULL,
            update_time BIGINT NOT NULL
        );
    `;

  await Promise.all(
    tags.map(
      (tag) => client.sql`
                INSERT INTO tag_tab (tag_name, tag_desc, tag_value_type, tag_status, create_time, update_time)
                VALUES (${tag.tag_name}, ${tag.tag_desc},${tag.tag_value_type}, ${tag.tag_status}, ${tag.create_time}, ${tag.update_time})
            `
    )
  );

  await client.sql`
    
    `;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedTags();
    await client.sql`COMMIT`;
    return Response.json({ message: 'OK' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    console.log(`seed DB error: ${error}`);
    return Response.json({ error }, { status: 500 });
  }
}

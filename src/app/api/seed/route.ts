import { db } from '@vercel/postgres';
import { tags } from '../../lib/mock-data';
import { NextResponse } from 'next/server';

const client = await db.connect();

async function seedSegment() {
  await client.sql`
        DROP TABLE IF EXISTS segment_tab;
    `;

  await client.sql`
      CREATE TABLE IF NOT EXISTS segment_tab (
        segment_id BIGSERIAL PRIMARY KEY,
        segment_name VARCHAR(64) NOT NULL,
        segment_desc VARCHAR(120) NOT NULL DEFAULT '',
        criteria TEXT NOT NULL,
        segment_status INTEGER NOT NULL,
        create_time BIGINT NOT NULL,
        update_time BIGINT NOT NULL
      );
  `;
}

async function seedUdTag() {
  await client.sql`
        DROP TABLE IF EXISTS ud_tag_tab;
    `;

  await client.sql`
      CREATE TABLE IF NOT EXISTS ud_tag_tab (
        tag_id BIGINT NOT NULL,
        ud_id VARCHAR(200) DEFAULT NULL,
        tag_val_str VARCHAR(100) DEFAULT NULL,
        tag_val_int BIGINT DEFAULT NULL,
        tag_val_float DECIMAL(10, 5) DEFAULT NULL,
        update_time BIGINT NOT NULL,
        CONSTRAINT uniq_tag_id_ud_id UNIQUE (tag_id, ud_id)
      );

      -- Index on tag_id and tag_value_str
      CREATE INDEX IF NOT EXISTS idx_tag_id_tag_val_str ON ud_tag_tab (tag_id, tag_val_str);

      -- Index on tag_id and tag_value_int
      CREATE INDEX IF NOT EXISTS idx_tag_id_tag_val_int ON ud_tag_tab (tag_id, tag_val_int);

      -- Index on tag_id and tag_value_float
      CREATE INDEX IF NOT EXISTS idx_tag_id_tag_val_float ON ud_tag_tab (tag_id, tag_val_float);
  `;
}

async function seedTask() {
  await client.sql`
        DROP TABLE IF EXISTS task_tab;
    `;

  await client.sql`
        CREATE TABLE IF NOT EXISTS task_tab (
            task_id BIGSERIAL PRIMARY KEY,
            tag_id BIGINT NOT NULL,
            file_url TEXT NOT NULL,
            task_status INTEGER NOT NULL,
            error_msg TEXT NOT NULL DEFAULT '',
            create_time BIGINT NOT NULL,
            update_time BIGINT NOT NULL
        );

        -- Index on tag_id and task_status
        CREATE INDEX IF NOT EXISTS idx_tag_id_task_status ON task_tab (tag_id, task_status);
    `;
}

async function seedTags() {
  await client.sql`
        DROP TABLE IF EXISTS tag_tab;
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

        -- Index on tag_id and tag_status
        CREATE INDEX IF NOT EXISTS idx_tag_id_status ON tag_tab (tag_id, tag_status);

        -- Index on tag_name, tag_desc, and tag_status
        CREATE INDEX IF NOT EXISTS idx_tag_name_desc_status ON tag_tab (tag_name, tag_desc, tag_status);
    `;

  await Promise.all(
    tags.map(
      (tag) => client.sql`
                INSERT INTO tag_tab (tag_name, tag_desc, tag_value_type, tag_status, create_time, update_time)
                VALUES (${tag.tag_name}, ${tag.tag_desc},${tag.tag_value_type}, ${tag.tag_status}, ${tag.create_time}, ${tag.update_time})
            `
    )
  );
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedTags();
    await seedTask();
    await seedUdTag();
    await seedSegment();
    await client.sql`COMMIT`;
    return NextResponse.json({ message: 'OK' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    console.log(`seed DB error: ${error}`);
    return NextResponse.json({ error }, { status: 500 });
  }
}

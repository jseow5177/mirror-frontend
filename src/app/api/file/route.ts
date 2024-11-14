import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';

import Queue from 'queue';
import { TaskStatus } from '@/app/lib/model';
import { Tag, TagStatus, TagValueType } from '@/app/lib/model/tag';

const FLOAT_PRECISION = 5;
const BATCH_SIZE = 1000;

const q = new Queue({
  concurrency: 10,
  autostart: true,
});

export async function POST(request: Request) {
  if (!request.body) {
    return NextResponse.json({ error: 'File is empty' });
  }

  const { searchParams } = new URL(request.url);
  const tagId = searchParams.get('tagId');
  const fileName = searchParams.get('fileName');
  const fileType = fileName?.split('.')[1]; // csv or txt

  const now = Date.now();

  try {
    // upload file
    const { url } = await put(
      `/mirror/tag/tag_${tagId}_${now}.${fileType}`,
      request.body,
      {
        access: 'public',
      }
    );

    // check if tag exists
    const tagData = await sql<Tag>`
        SELECT *
        FROM tag_tab
        WHERE tag_id = ${tagId} AND tag_status = ${TagStatus.Normal}
    `;

    const tag = tagData.rows[0];
    if (!tag) {
      return NextResponse.json({ error: 'tag not found' });
    }

    // create task
    const data = await sql`
        INSERT INTO task_tab (tag_id, task_status, file_url, create_time, update_time)
        VALUES (${tagId}, ${TaskStatus.Pending}, ${url}, ${now}, ${now})
        RETURNING task_id;
      `;

    const taskID = data.rows[0].task_id;

    // push to queue
    q.push(() => {
      return upsertTagData(taskID, tag, url);
    });

    return NextResponse.json({ message: 'ok' });
  } catch (error) {
    console.log(`uploadFile err: ${error}`);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json({
      message: 'Failed to update tag.',
      error: errorMessage,
    });
  }
}

type UdTagVal = {
  UdID: string;
  TagVal?: string | number;
};

async function upsertTagData(taskID: number, tag: Tag, fileUrl: string) {
  const now = Date.now();

  try {
    const res = await fetch(fileUrl);

    if (!res.ok || res.body == null) {
      throw new Error('Fail to fetch file');
    }

    // running...
    await sql`
      UPDATE task_tab
      SET task_status = ${TaskStatus.Running}, update_time=${now}
      WHERE task_id = ${taskID};
    `;

    // read file lines
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    const lines: string[] = [];
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;

      const chunk = decoder.decode(value, { stream: true });
      const subLines = chunk.split(/\r?\n/);

      subLines.forEach((subLine) => {
        const line = subLine.trim();
        if (line !== '') {
          lines.push(line);
        }
      });
    }

    const inserts: UdTagVal[] = [];
    const deletes: UdTagVal[] = [];

    // validate lines
    lines.forEach((line, i) => {
      const udTagVal = line.split(',');
      if (udTagVal.length != 2) {
        throw new Error(`Line ${i} is invalid.`);
      }

      const udID = udTagVal[0].trim();
      const tagVal = udTagVal[1].trim();

      if (tagVal === '') {
        deletes.push({
          UdID: udID,
        });
      } else {
        let v: string | number;
        switch (tag.value_type) {
          case TagValueType.Str: // no-op
            v = tagVal;
            break;
          case TagValueType.Float:
            if (!isFloat(tagVal, FLOAT_PRECISION)) {
              throw new Error(`Tag value at line ${i} is an invalid decimal.`);
            }
            v = Number(tagVal);
            break;
          case TagValueType.Int:
            if (!isInt(tagVal)) {
              throw new Error(`Tag value at line ${i} is an invalid integer.`);
            }
            v = Number(tagVal);
            break;
        }
        inserts.push({
          UdID: udID,
          TagVal: v,
        });
      }
    });

    // process deletes first
    for (let i = 0; i < deletes.length; i += BATCH_SIZE) {
      const start = i;
      const end = Math.min(start + BATCH_SIZE, deletes.length);
      const batch = deletes.slice(start, end);

      let udIDCond = '';
      batch.forEach((udTag, i) => {
        udIDCond += udTag.UdID;
        if (i != batch.length - 1) {
          udIDCond += ',';
        }
      });

      try {
        await sql`
          DELETE FROM ud_tag_tab
          WHERE tag_id = ${tag.id} AND ud_id IN (${udIDCond});
        `;
      } catch (error) {
        console.log(`delete errors: ${error}`);
        throw new Error('Encounter delete errors');
      }
    }

    // process inserts next
    // TODO: HOW TO WRITE BATCH INSERTS WITHOUT SQL INJECTION ERROR??
    for (const udTag of inserts) {
      try {
        switch (tag.value_type) {
          case TagValueType.Str:
            await sql`
              INSERT INTO ud_tag_tab (tag_id, ud_id, tag_val_str, update_time)
              VALUES (${tag.id}, ${udTag.UdID}, ${udTag.TagVal}, ${now})
              ON CONFLICT (tag_id, ud_id) 
              DO UPDATE SET
                tag_val_str = EXCLUDED.tag_val_str,
                update_time = EXCLUDED.update_time;
            `;
            break;
          case TagValueType.Int:
            await sql`
              INSERT INTO ud_tag_tab (tag_id, ud_id, tag_val_int, update_time)
              VALUES (${tag.id}, ${udTag.UdID}, ${udTag.TagVal}, ${now})
              ON CONFLICT (tag_id, ud_id) 
              DO UPDATE SET
                tag_val_int = EXCLUDED.tag_val_int,
                update_time = EXCLUDED.update_time;
            `;
            break;
          case TagValueType.Float:
            await sql`
              INSERT INTO ud_tag_tab (tag_id, ud_id, tag_val_float, update_time)
              VALUES (${tag.id}, ${udTag.UdID}, ${udTag.TagVal}, ${now})
              ON CONFLICT (tag_id, ud_id) 
              DO UPDATE SET
                tag_val_float = EXCLUDED.tag_val_float,
                update_time = EXCLUDED.update_time;
            `;
            break;
        }
      } catch (error) {
        console.log(`insert errors: ${error}`);
        throw new Error('Encounter insert errors');
      }
    }

    // done
    await sql`
      UPDATE task_tab
      SET task_status = ${TaskStatus.Success}, update_time=${now}
      WHERE task_id = ${taskID};
    `;

    console.log(`task ${taskID} done!`);
  } catch (error) {
    console.log(`task error encountered: ${error}`);

    const errorMessage = error instanceof Error ? error.message : String(error);
    await sql`
      UPDATE task_tab
      SET task_status = ${TaskStatus.Failed}, update_time=${Date.now()}, error_msg=${errorMessage}
      WHERE task_id = ${taskID};
    `;
  }
}

function isInt(str: string) {
  return /^-?\d+$/.test(str);
}

function isFloat(str: string, precision: number) {
  const regex = new RegExp(`^-?\\d+(\\.\\d{1,${precision}})?$`);
  return regex.test(str);
}

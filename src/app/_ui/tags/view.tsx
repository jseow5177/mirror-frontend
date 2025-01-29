'use client';

import { Tag, TagValueTypes } from '@/app/_lib/model/tag';
import { convertUnixToLocalTime } from '@/app/_lib/utils';

export default function TagView({ tag }: { tag: Tag }) {
  const tagCreateTime = convertUnixToLocalTime(tag.create_time);
  const tagUpdateTime = convertUnixToLocalTime(tag.update_time);

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '200px auto',
          rowGap: '16px',
          marginBottom: '16px',
        }}
      >
        <p>
          <strong>Name:</strong>
        </p>
        <p>{tag.name}</p>

        <p>
          <strong>Description:</strong>
        </p>
        <p>{tag.tag_desc}</p>

        <p>
          <strong>Tag Value Type:</strong>
        </p>
        <p>{TagValueTypes[tag.value_type]}</p>

        <p>
          <strong>Create Time:</strong>
        </p>
        <p>
          {tagCreateTime.date}, {tagCreateTime.time}
        </p>

        <p>
          <strong>Update Time:</strong>
        </p>
        <p>
          {tagUpdateTime.date}, {tagUpdateTime.time}
        </p>
      </div>
    </div>
  );
}

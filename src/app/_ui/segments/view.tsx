import { Segment } from '@/app/_lib/model/segment';
import { Tag } from '@/app/_lib/model/tag';
import { convertUnixToLocalTime } from '@/app/_lib/utils';
import { QueryBuilder } from './query-builder';

export default async function SegmentView({
  segment,
  tags,
}: {
  segment: Segment;
  tags: Tag[];
}) {
  const segmentCreateTime = convertUnixToLocalTime(segment.create_time);
  const segmentUpdateTime = convertUnixToLocalTime(segment.update_time);

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
        <p>{segment.name}</p>

        <p>
          <strong>Description:</strong>
        </p>
        <p>{segment.segment_desc}</p>

        <p>
          <strong>Create Time:</strong>
        </p>
        <p>
          {segmentCreateTime.date}, {segmentCreateTime.time}
        </p>

        <p>
          <strong>Update Time:</strong>
        </p>
        <p>
          {segmentUpdateTime.date}, {segmentUpdateTime.time}
        </p>

        <p>
          <strong>Criteria:</strong>
        </p>
      </div>
      <QueryBuilder tags={tags} initialCriteria={segment.criteria} readonly />
    </div>
  );
}

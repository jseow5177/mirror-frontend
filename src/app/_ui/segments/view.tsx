import { Segment } from '@/app/_lib/model/segment';
import { Tag } from '@/app/_lib/model/tag';
import { convertUnixToLocalTime } from '@/app/_lib/utils';
import { QueryBuilder } from './query-builder';
import { DetailGrid, DetailRow } from '../detail';

export default async function SegmentView({
  segment,
  tags,
  size,
}: {
  segment: Segment;
  tags: Tag[];
  size: number;
}) {
  const segmentCreateTime = convertUnixToLocalTime(segment.create_time);
  const segmentUpdateTime = convertUnixToLocalTime(segment.update_time);

  return (
    <>
      <DetailGrid>
        <DetailRow label='Name' value={segment.name} />
        <DetailRow label='Description' value={segment.segment_desc} />
        <DetailRow label='Size' value={size} />
        <DetailRow
          label='Create Time'
          value={`${segmentCreateTime.date}, ${segmentCreateTime.time}`}
        />
        <DetailRow
          label='Update Time'
          value={`${segmentUpdateTime.date}, ${segmentUpdateTime.time}`}
        />
        <DetailRow label='Criteria' value={''} />
      </DetailGrid>
      <QueryBuilder tags={tags} initialCriteria={segment.criteria} readonly />
    </>
  );
}

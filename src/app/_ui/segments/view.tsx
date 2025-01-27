import { Segment } from '@/app/_lib/model/segment';
import { Tag } from '@/app/_lib/model/tag';

export default async function SegmentView({
  segment,
  tags,
}: {
  segment: Segment;
  tags: Tag[];
}) {
  return <div>Segment?</div>;
}

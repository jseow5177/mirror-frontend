import { Segment } from '@/app/lib/model/segment';
import { Tag } from '@/app/lib/model/tag';

export default async function SegmentView({
  segment,
  tags,
}: {
  segment: Segment;
  tags: Tag[];
}) {
  return <div>Segment?</div>;
}

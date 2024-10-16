import BaseBreadcrumbs from '@/app/ui/breadcrumbs';
import { getSegment } from '@/app/lib/segment-data';
import { getAllTags } from '@/app/lib/tag-data';
import { notFound } from 'next/navigation';
import SegmentView from '@/app/ui/segments/segment-view';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const fetchTaskData = async () => {
    const segmentID = Number(id) | 0;

    const [segment, tags] = await Promise.all([
      getSegment(segmentID),
      getAllTags(),
    ]);

    return {
      segment,
      tags,
    };
  };

  const { segment, tags } = await fetchTaskData();

  if (!segment) {
    notFound();
  }

  return (
    <main>
      <BaseBreadcrumbs
        breadcrumbs={[
          { label: 'Segments', href: '/dashboard/segments' },
          {
            label: 'View Segment',
            href: `/dashboard/segments/${id}`,
          },
        ]}
      />
      <SegmentView segment={segment} tags={tags} />
    </main>
  );
}

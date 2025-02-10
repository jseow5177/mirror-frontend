import BaseBreadcrumbs from '@/app/_ui/breadcrumbs';
import { countUd, getSegment } from '@/app/_lib/data/segment';
import { getTags } from '@/app/_lib/data/tag';
import { notFound } from 'next/navigation';
import SegmentView from '@/app/_ui/segments/view';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const id = p.id;

  const fetchData = async () => {
    const segmentID = Number(id) | 0;

    const [segment, resp, size] = await Promise.all([
      getSegment(segmentID),
      getTags(),
      countUd(segmentID),
    ]);

    return {
      segment,
      resp,
      size,
    };
  };

  const { segment, resp, size } = await fetchData();

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
      <SegmentView segment={segment} tags={resp[0].tags} size={size} />
    </main>
  );
}

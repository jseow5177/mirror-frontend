import BaseBreadcrumbs from '@/app/_ui/breadcrumbs';
import { getSegment } from '@/app/_lib/data/segment';
import { getTags } from '@/app/_lib/data/tag';
import { notFound } from 'next/navigation';
import SegmentView from '@/app/_ui/segments/view';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const fetchData = async () => {
    const segmentID = Number(id) | 0;

    const [segment, resp] = await Promise.all([
      getSegment(segmentID),
      getTags(),
    ]);

    return {
      segment,
      resp,
    };
  };

  const { segment, resp } = await fetchData();

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
      <SegmentView segment={segment} tags={resp[0].tags} />
    </main>
  );
}

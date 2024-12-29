import BaseBreadcrumbs from '@/app/ui/breadcrumbs';
import { getSegment } from '@/app/lib/segment-data';
import { getAllTags, getTags } from '@/app/lib/tag-data';
import { notFound } from 'next/navigation';
import SegmentView from '@/app/ui/segments/view';

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

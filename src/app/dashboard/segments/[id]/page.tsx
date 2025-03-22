import BaseBreadcrumbs from '@/app/_ui/breadcrumbs';
import { countUd, getSegment } from '@/app/_lib/data/segment';
import { getTags } from '@/app/_lib/data/tag';
import { notFound } from 'next/navigation';
import SegmentView from '@/app/_ui/segments/view';
import toast from 'react-hot-toast';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const id = p.id;

  const fetchData = async () => {
    const segmentID = Number(id) | 0;

    const [segment, resp, { count: size, error: countUdError }] =
      await Promise.all([getSegment(segmentID), getTags(), countUd(segmentID)]);

    return {
      segment,
      resp,
      size,
      countUdError,
    };
  };

  const { segment, resp, size, countUdError } = await fetchData();

  if (!segment) {
    notFound();
  }

  if (countUdError) {
    toast.error(countUdError);
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

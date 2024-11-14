import Breadcrumbs from '@/app/ui/breadcrumbs';
import SegmentForm from '@/app/ui/segments/form';
import { getTags } from '@/app/lib/tag-data';

export default async function Page() {
  const resp = await getTags();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Segments', href: '/dashboard/segments' },
          {
            label: 'Create Segment',
            href: '/dashboard/segments/create',
            isCurrent: true,
          },
        ]}
      />
      <SegmentForm tags={resp[0].tags} />
    </main>
  );
}

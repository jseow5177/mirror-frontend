export const dynamic = 'force-dynamic';

import Breadcrumbs from '@/app/_ui/breadcrumbs';
import SegmentForm from '@/app/_ui/segments/form';
import { getTags } from '@/app/_lib/data/tag';

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

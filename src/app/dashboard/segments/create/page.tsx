import Breadcrumbs from '@/app/ui/breadcrumbs';
import SegmentForm from '@/app/ui/segments/form';
import { getAllTags } from '@/app/lib/tag-data';

export default async function Page() {
  const tags = await getAllTags();

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
      <SegmentForm tags={tags} />
    </main>
  );
}

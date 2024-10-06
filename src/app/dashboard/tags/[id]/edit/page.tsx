import Breadcrumbs from '@/app/ui/breadcrumbs';
import TagForm from '@/app/ui/tags/form';
import { notFound } from 'next/navigation';
import { getTag } from '@/app/lib/data';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const tag = await getTag(Number(id));

  if (!tag) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tags', href: '/dashboard/tags' },
          {
            label: 'Edit Tag',
            href: `/dashboard/tags/${id}/edit`,
            active: true,
          },
        ]}
      />
      <TagForm tag={tag} />
    </main>
  );
}

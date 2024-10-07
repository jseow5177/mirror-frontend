import { notFound } from 'next/navigation';
import { getTag } from '@/app/lib/data';
import TagView from '@/app/ui/tags/tag';
import BaseBreadcrumbs from '@/app/ui/breadcrumbs';
import Link from 'next/link';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const tag = await getTag(Number(id));

  if (!tag) {
    notFound();
  }

  return (
    <main>
      <BaseBreadcrumbs
        breadcrumbs={[
          { label: 'Tags', href: '/dashboard/tags' },
          {
            label: 'View Tag',
            href: `/dashboard/tags/${id}`,
          },
        ]}
      />
      <TagView tag={tag} />
    </main>
  );
}

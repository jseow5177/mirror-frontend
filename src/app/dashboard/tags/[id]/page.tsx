import { notFound } from 'next/navigation';
import { getTag } from '@/app/_lib/data/tag';
import TagView from '@/app/_ui/tags/view';
import BaseBreadcrumbs from '@/app/_ui/breadcrumbs';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const fetchTag = async () => {
    const tagID = Number(id) | 0;

    const [tag] = await Promise.all([getTag(tagID)]);

    return {
      tag,
    };
  };

  const { tag } = await fetchTag();

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

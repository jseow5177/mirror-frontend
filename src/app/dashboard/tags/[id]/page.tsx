import { notFound } from 'next/navigation';
import { getTag } from '@/app/_lib/data/tag';
import TagView from '@/app/_ui/tags/view';
import BaseBreadcrumbs from '@/app/_ui/breadcrumbs';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

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
      <div className='flex justify-between'>
        <BaseBreadcrumbs
          breadcrumbs={[
            { label: 'Tags', href: '/dashboard/tags' },
            {
              label: 'View Tag',
              href: `/dashboard/tags/${id}`,
            },
          ]}
        />
        <Button
          as={Link}
          startContent={<ArrowUpTrayIcon className='w-4' />}
          color='primary'
          href={`/dashboard/tags/${id}/upload`}
          variant='solid'
        >
          Upload Data
        </Button>
      </div>
      <TagView tag={tag} />
    </main>
  );
}

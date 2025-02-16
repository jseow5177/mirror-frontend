import { notFound } from 'next/navigation';
import { getTag } from '@/app/_lib/data/tag';
import TagView from '@/app/_ui/tags/view';
import BaseBreadcrumbs from '@/app/_ui/breadcrumbs';
import { Button, Link } from '@heroui/react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { getTagFileUploadTasks } from '@/app/_lib/data/task';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  const p = await params;
  const sp = await searchParams;

  const currentTaskPage = Number(sp?.page) || 1;
  const id = p.id;

  const fetchTagData = async () => {
    const tagID = Number(id) | 0;

    const [tag, resp] = await Promise.all([
      getTag(tagID),
      getTagFileUploadTasks(tagID, currentTaskPage),
    ]);

    return {
      tag,
      resp,
    };
  };

  const { tag, resp } = await fetchTagData();

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
      <TagView tag={tag} tasks={resp[0].tasks || []} totalTasks={resp[1]} />
    </main>
  );
}

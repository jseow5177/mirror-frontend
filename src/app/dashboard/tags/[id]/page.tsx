import { notFound } from 'next/navigation';
import { getTag } from '@/app/_lib/data/tag';
import TagView from '@/app/_ui/tags/view';
import BaseBreadcrumbs from '@/app/_ui/breadcrumbs';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { getTagFileUploadTasks } from '@/app/_lib/data/task';
import TaskTable from '@/app/_ui/tags/task-table';
import BasePagination from '@/app/_ui/pagination';

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: {
    page?: string;
  };
}) {
  const id = params.id;
  const currentTaskPage = Number(searchParams?.page) || 1;

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

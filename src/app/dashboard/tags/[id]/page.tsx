import { notFound } from 'next/navigation';
import { getTag, getTasks, countTasksPages } from '@/app/_lib/data/tag';
import TagView from '@/app/_ui/tags/tag-view';
import BaseBreadcrumbs from '@/app/_ui/breadcrumbs';
import TaskTable from '@/app/_ui/tags/task-table';
import BasePagination from '@/app/_ui/pagination';

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const id = params.id;
  const currentPage = Number(searchParams?.page) || 1;

  const fetchTaskData = async () => {
    const tagID = Number(id) | 0;

    const [tag, totalPages, tasks] = await Promise.all([
      getTag(tagID),
      countTasksPages(tagID),
      getTasks(tagID, currentPage),
    ]);

    return {
      tag,
      totalPages,
      tasks,
    };
  };

  const { tag, totalPages, tasks } = await fetchTaskData();

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
      <div className='mt-5'>
        <h2 className='text-xl'>Tasks</h2>
        <div className='mt-3'>
          <TaskTable tasks={tasks} />
        </div>
        <div className='mt-5 flex w-full justify-end'>
          <BasePagination totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
}

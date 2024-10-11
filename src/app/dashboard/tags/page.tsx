import SearchBar from '@/app/ui/search-bar';
import { countTagsPages, getTags } from '@/app/lib/data';
import TagTable from '@/app/ui/tags/tag-table';
import { CreateTag } from '@/app/ui/tags/buttons';
import { Pagination } from '@nextui-org/react';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const fetchTagData = async () => {
    const [totalPages, tags] = await Promise.all([
      countTagsPages(query),
      getTags(query, currentPage),
    ]);

    return {
      totalPages,
      tags,
    };
  };

  const { totalPages, tags } = await fetchTagData();

  return (
    <div className='min-h-screen w-full'>
      <h1 className='mb-8 text-2xl'>Tags</h1>
      <div className='mb-5 flex items-center justify-between gap-2'>
        <SearchBar placeholder='Search tags...' />
        <CreateTag />
      </div>
      <TagTable tags={tags} />
      <div className='mt-5 flex w-full justify-end'>
        <Pagination showControls total={totalPages} initialPage={1} />
      </div>
    </div>
  );
}

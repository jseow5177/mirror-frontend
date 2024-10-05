import Pagination from '@/app/ui/pagination';
import { LinkButton } from '@/app/ui/buttons';
import SearchBar from '@/app/ui/search-bar';
import { countTagsPages } from '@/app/lib/data';
import { PlusIcon } from '@heroicons/react/24/outline';
import Table from '@/app/ui/tags/table';
import { CreateTag } from '@/app/ui/tags/buttons';

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

  const totalPages = await countTagsPages(query);

  return (
    <div className='min-h-screen w-full'>
      <div className='flex w-full items-center justify-between'>
        <h1 className='text-2xl'>Tags</h1>
      </div>
      <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
        <SearchBar placeholder='Search tags...' />
        <CreateTag />
      </div>
      <Table query={query} currentPage={currentPage} />
      <div className='mt-5 flex w-full justify-end'>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

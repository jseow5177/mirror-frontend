import SearchBar from '@/app/_ui/search-bar';
import { getTags } from '@/app/_lib/data/tag';
import TagTable from '@/app/_ui/tags/table';
import { CreateTag } from '@/app/_ui/tags/buttons';
import BasePagination from '@/app/_ui/pagination';

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
    const [resp] = await Promise.all([getTags(currentPage, query)]);

    return {
      resp,
    };
  };

  const { resp } = await fetchTagData();

  return (
    <main className='w-full'>
      <h1 className='mb-8 text-2xl'>Tags</h1>
      <div className='mb-5 flex items-center justify-between gap-2'>
        <SearchBar placeholder='Search tags...' />
        <CreateTag />
      </div>
      <TagTable tags={resp[0].tags || []} />
      <div className='mt-5 flex w-full justify-end'>
        <BasePagination totalPages={resp[1]} />
      </div>
    </main>
  );
}

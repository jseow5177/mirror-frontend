import SearchBar from '@/app/ui/search-bar';
import { getTags } from '@/app/lib/tag-data';
import TagTable from '@/app/ui/tags/tag-table';
import { CreateTag } from '@/app/ui/tags/buttons';
import BasePagination from '@/app/ui/pagination';

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
    const [resp] = await Promise.all([getTags(query, currentPage)]);

    return {
      resp,
    };
  };

  const { resp } = await fetchTagData();

  return (
    <main className='min-h-screen w-full'>
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

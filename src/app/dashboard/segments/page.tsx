export const dynamic = 'force-dynamic';

import SearchBar from '@/app/_ui/search-bar';
import { getSegments } from '@/app/_lib/data/segment';
import SegmentTable from '@/app/_ui/segments/table';
import BasePagination from '@/app/_ui/pagination';
import { CreateSegment } from '@/app/_ui/segments/buttons';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const query = sp?.query || '';
  const currentPage = Number(sp?.page) || 1;

  const fetchSegmentData = async () => {
    const [resp] = await Promise.all([getSegments(currentPage, query)]);

    return {
      resp,
    };
  };

  const { resp } = await fetchSegmentData();

  return (
    <main className='w-full'>
      <h1 className='mb-8 text-2xl'>Segments</h1>
      <div className='mb-5 flex items-center justify-between gap-2'>
        <SearchBar placeholder='Search segments...' />
        <CreateSegment />
      </div>
      <SegmentTable segments={resp[0].segments || []} />
      <div className='mt-5 flex w-full justify-end'>
        <BasePagination totalPages={resp[1]} />
      </div>
    </main>
  );
}

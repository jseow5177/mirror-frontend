import SearchBar from '@/app/ui/search-bar';
import { countSegmentsPages, getSegments } from '@/app/lib/segment-data';
import SegmentTable from '@/app/ui/segments/segment-table';
import BasePagination from '@/app/ui/pagination';
import { CreateSegment } from '@/app/ui/segments/buttons';

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

  const fetchSegmentData = async () => {
    const [totalPages, segments] = await Promise.all([
      countSegmentsPages(query),
      getSegments(query, currentPage),
    ]);

    return {
      totalPages,
      segments,
    };
  };

  const { totalPages, segments } = await fetchSegmentData();

  return (
    <main className='min-h-screen w-full'>
      <h1 className='mb-8 text-2xl'>Segments</h1>
      <div className='mb-5 flex items-center justify-between gap-2'>
        <SearchBar placeholder='Search segments...' />
        <CreateSegment />
      </div>
      <SegmentTable segments={segments} />
      <div className='mt-5 flex w-full justify-end'>
        <BasePagination totalPages={totalPages} />
      </div>
    </main>
  );
}

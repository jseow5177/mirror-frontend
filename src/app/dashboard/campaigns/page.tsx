import { CreateCampaign } from '@/app/ui/campaigns/buttons';
import CampaignTable from '@/app/ui/campaigns/table';
import BasePagination from '@/app/ui/pagination';
import SearchBar from '@/app/ui/search-bar';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  return (
    <main className='w-full'>
      <h1 className='mb-8 text-2xl'>Campaigns</h1>
      <div className='mb-5 flex items-center justify-between gap-2'>
        <SearchBar placeholder='Search campaigns...' />
        <CreateCampaign />
      </div>
      <CampaignTable campaigns={[]} />
      <div className='mt-5 flex w-full justify-end'>
        <BasePagination totalPages={0} />
      </div>
    </main>
  );
}

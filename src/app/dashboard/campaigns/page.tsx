import { CreateCampaign } from '@/app/ui/campaigns/buttons';
import CampaignTable from '@/app/ui/campaigns/table';
import BasePagination from '@/app/ui/pagination';
import SearchBar from '@/app/ui/search-bar';
import { getCampaigns } from '@/app/lib/campaign-data';

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

  const fetchCampaignData = async () => {
    const [resp] = await Promise.all([getCampaigns(currentPage, query)]);

    return {
      resp,
    };
  };

  const { resp } = await fetchCampaignData();

  return (
    <main className='w-full'>
      <h1 className='mb-8 text-2xl'>Campaigns</h1>
      <div className='mb-5 flex items-center justify-between gap-2'>
        <SearchBar placeholder='Search campaigns...' />
        <CreateCampaign />
      </div>
      <CampaignTable campaigns={resp[0].campaigns || []} />
      <div className='mt-5 flex w-full justify-end'>
        <BasePagination totalPages={resp[1]} />
      </div>
    </main>
  );
}

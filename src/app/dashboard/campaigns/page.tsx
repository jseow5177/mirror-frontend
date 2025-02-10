import { CreateCampaign } from '@/app/_ui/campaigns/buttons';
import CampaignTable from '@/app/_ui/campaigns/table';
import BasePagination from '@/app/_ui/pagination';
import SearchBar from '@/app/_ui/search-bar';
import { getCampaigns } from '@/app/_lib/data/campaign';

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

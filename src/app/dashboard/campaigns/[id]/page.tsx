import { getCampaign } from '@/app/lib/campaign-data';
import BaseBreadcrumbs from '@/app/ui/breadcrumbs';
import CampaignView from '@/app/ui/campaigns/view';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const fetchData = async () => {
    const campaignID = Number(id) | 0;

    const [campaign] = await Promise.all([getCampaign(campaignID)]);

    return {
      campaign,
    };
  };

  const { campaign } = await fetchData();

  if (!campaign) {
    notFound();
  }

  return (
    <main>
      <BaseBreadcrumbs
        breadcrumbs={[
          { label: 'Campaigns', href: '/dashboard/campaigns' },
          {
            label: 'View Campaign',
            href: `/dashboard/campaigns/${id}`,
          },
        ]}
      />
      <CampaignView campaign={campaign} />
    </main>
  );
}

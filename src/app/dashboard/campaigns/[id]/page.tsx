import { getCampaign } from '@/app/_lib/data/campaign';
import BaseBreadcrumbs from '@/app/_ui/breadcrumbs';
import CampaignView from '@/app/_ui/campaigns/view';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const id = p.id;

  const fetchData = async () => {
    const campaignID = Number(id) | 0;

    const [resp] = await Promise.all([getCampaign(campaignID)]);

    return {
      campaign: resp[0],
      segment: resp[1],
    };
  };

  const { campaign, segment } = await fetchData();

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
      <CampaignView campaign={campaign} segment={segment} />
    </main>
  );
}

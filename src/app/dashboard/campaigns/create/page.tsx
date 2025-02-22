export const dynamic = 'force-dynamic';

import { getEmails } from '@/app/_lib/data/email';
import { getSegments } from '@/app/_lib/data/segment';
import Breadcrumbs from '@/app/_ui/breadcrumbs';
import CampaignForm from '@/app/_ui/campaigns/form';

export default async function Page() {
  const fetchCampaignData = async () => {
    const [emailsResp, segmentsResp] = await Promise.all([
      getEmails(),
      getSegments(),
    ]);

    return {
      emails: emailsResp[0].emails,
      segments: segmentsResp[0].segments,
    };
  };

  const { emails, segments } = await fetchCampaignData();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Campaigns', href: '/dashboard/campaigns' },
          {
            label: 'Create Campaign',
            href: '/dashboard/campaigns/create',
            isCurrent: true,
          },
        ]}
      />
      <CampaignForm emails={emails} segments={segments} />
    </main>
  );
}

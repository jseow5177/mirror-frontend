export const dynamic = 'force-dynamic';

import { getEmails } from '@/app/_lib/data/email';
import { getSegments } from '@/app/_lib/data/segment';
import { getSenders } from '@/app/_lib/data/tenant';
import Breadcrumbs from '@/app/_ui/breadcrumbs';
import CampaignForm from '@/app/_ui/campaigns/form';

export default async function Page() {
  const fetchCampaignData = async () => {
    const [emailsResp, segmentsResp, senders] = await Promise.all([
      getEmails(),
      getSegments(),
      getSenders(),
    ]);

    return {
      emails: emailsResp[0].emails,
      segments: segmentsResp[0].segments,
      senders: senders,
    };
  };

  const { emails, segments, senders } = await fetchCampaignData();

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
      <CampaignForm emails={emails} segments={segments} senders={senders} />
    </main>
  );
}

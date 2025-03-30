export const dynamic = 'force-dynamic';

import { getSenders, getTenant } from '@/app/_lib/data/tenant';
import EmailSetting from '@/app/_ui/settings/email';

export default async function Page() {
  const fetchGeneralData = async () => {
    const [tenant, senders] = await Promise.all([getTenant(), getSenders()]);

    return {
      tenant,
      senders,
    };
  };

  const { tenant, senders } = await fetchGeneralData();

  return (
    <main className='w-full'>
      <EmailSetting tenant={tenant} senders={senders} />
    </main>
  );
}

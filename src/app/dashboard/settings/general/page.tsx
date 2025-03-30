export const dynamic = 'force-dynamic';

import { getTenant } from '@/app/_lib/data/tenant';
import { getMe } from '@/app/_lib/data/users';
import General from '@/app/_ui/settings/general';

export default async function Page() {
  const fetchGeneralData = async () => {
    const [tenant, me] = await Promise.all([getTenant(), getMe()]);

    return {
      tenant,
      me,
    };
  };

  const { tenant, me } = await fetchGeneralData();

  return (
    <main className='w-full'>
      <General me={me} tenant={tenant} />
    </main>
  );
}

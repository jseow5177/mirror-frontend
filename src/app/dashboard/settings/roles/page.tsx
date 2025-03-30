import { getActions, getRoles } from '@/app/_lib/data/role';
import { getMe } from '@/app/_lib/data/users';
import Roles from '@/app/_ui/settings/roles';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const fetchRolesData = async () => {
    const [actions, roles, me] = await Promise.all([
      getActions(),
      getRoles(),
      getMe(),
    ]);

    return {
      actions,
      roles,
      me,
    };
  };

  const { actions, roles, me } = await fetchRolesData();

  return (
    <main className='w-full'>
      <Roles actions={actions} roles={roles} me={me} />
    </main>
  );
}

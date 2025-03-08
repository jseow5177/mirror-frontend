import { getActions, getRoles } from '@/app/_lib/data/role';
import Roles from '@/app/_ui/settings/roles';

export default async function Page() {
  const fetchRolesData = async () => {
    const [actions, roles] = await Promise.all([getActions(), getRoles()]);

    return {
      actions,
      roles,
    };
  };

  const { actions, roles } = await fetchRolesData();

  return (
    <main className='w-full'>
      <h1 className='mb-8 text-2xl'>Your Roles</h1>
      <Roles actions={actions} roles={roles} />
    </main>
  );
}

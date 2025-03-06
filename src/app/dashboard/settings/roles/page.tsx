import { getActions, getRoles } from '@/app/_lib/data/role';

export default async function Page() {
  const fetchRolesData = async () => {
    const [actions, roles] = await Promise.all([getActions(), getRoles()]);

    return {
      actions,
      roles,
    };
  };

  await fetchRolesData();

  return (
    <main className='w-full'>
      <h2 className='text-xl'>Roles</h2>
    </main>
  );
}

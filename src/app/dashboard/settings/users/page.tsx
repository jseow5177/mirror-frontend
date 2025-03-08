import { getRoles } from '@/app/_lib/data/role';
import { getMe, getUsers } from '@/app/_lib/data/users';
import { ActionCode } from '@/app/_lib/model/role';
import BasePagination from '@/app/_ui/pagination';
import SearchBar from '@/app/_ui/search-bar';
import { CreateUsers } from '@/app/_ui/settings/buttons';
import UserTable from '@/app/_ui/settings/user-table';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    status?: string;
  }>;
}) {
  const sp = await searchParams;
  const query = sp?.query || '';
  const currentPage = Number(sp?.page) || 1;
  const status = sp?.status || '';

  const fetchUsersData = async () => {
    const [resp, roles, me] = await Promise.all([
      getUsers(currentPage, query, status.split(',')),
      getRoles(),
      getMe(),
    ]);

    return {
      resp,
      roles,
      me,
    };
  };

  const { resp, roles, me } = await fetchUsersData();

  return (
    <main className='w-full'>
      <h1 className='mb-8 text-2xl'>Your Users</h1>
      <div className='mb-5 flex items-center justify-between gap-2'>
        <SearchBar placeholder='Search users...' />
        {me.role.actions.includes(ActionCode.EditUser) && (
          <CreateUsers roles={roles} />
        )}
      </div>
      <UserTable users={resp[0].users || []} />
      <div className='mt-5 flex w-full justify-end'>
        <BasePagination totalPages={resp[1]} />
      </div>
    </main>
  );
}

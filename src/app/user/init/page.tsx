import Title from '@/app/_ui/title';
import InitUserForm from '@/app/_ui/user/init-form';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    token?: string;
  }>;
}) {
  const sp = await searchParams;
  const token = sp?.token || '';

  return (
    <main className='flex min-h-screen w-full flex-col items-center justify-center'>
      <Title title='Set your password' />
      <InitUserForm token={token} />
    </main>
  );
}

import TrialAccountForm from '../_ui/trial/form';

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
    <main className='flex h-[100vh] w-full items-center justify-center'>
      <TrialAccountForm token={token} />
    </main>
  );
}

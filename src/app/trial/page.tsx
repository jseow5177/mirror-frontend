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
    <main className='flex min-h-screen w-full items-center justify-center'>
      <TrialAccountForm token={token} />
    </main>
  );
}

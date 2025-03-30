import SideNav from '@/app/_ui/dashboard/side-nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex h-screen flex-row overflow-hidden'>
      <div className='w-64 flex-none'>
        <SideNav />
      </div>
      <div className='flex-grow overflow-y-auto p-10'>{children}</div>
    </main>
  );
}

import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen flex-row overflow-hidden'>
      <div className='w-64 flex-none'>
        <SideNav />
      </div>
      <div className='flex-grow overflow-y-auto p-12'>{children}</div>
    </div>
  );
}

import SideBar from '@/app/_ui/dashboard/side-bar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full'>
      <h1 className='mb-8 text-2xl'>Settings</h1>
      <section className='flex'>
        <SideBar />
        <div className='w-full pl-6'>{children}</div>
      </section>
    </div>
  );
}

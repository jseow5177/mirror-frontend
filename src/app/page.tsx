import Title from './ui/title';
import LogInForm from './ui/user/form';

export default function Home() {
  return (
    <main className='flex min-h-screen w-full flex-col items-center justify-center'>
      <Title title='Welcome to Mirror' />
      <LogInForm />
    </main>
  );
}

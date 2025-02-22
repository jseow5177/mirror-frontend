import Title from './_ui/title';
import LogInForm from './_ui/user/login-form';

export default async function Home() {
  return (
    <main className='flex min-h-screen w-full flex-col items-center justify-center'>
      <Title title='Welcome to Mirror' />
      <LogInForm />
    </main>
  );
}

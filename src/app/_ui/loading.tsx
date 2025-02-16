import { Spinner } from '@heroui/react';

export default function BaseLoading() {
  return (
    <main className='flex h-full flex-col items-center justify-center'>
      <Spinner size='lg' color='primary' />
    </main>
  );
}

import { Spinner } from '@nextui-org/react';

export default function Loading() {
  return (
    <main className='flex h-full flex-col items-center justify-center'>
      <Spinner size='lg' color='primary' />
    </main>
  );
}

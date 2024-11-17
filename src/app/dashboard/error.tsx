'use client';

import { useEffect } from 'react';
import { Button } from '@nextui-org/react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className='flex h-full flex-col items-center justify-center gap-3'>
      <h2 className='text-center'>Something went wrong!</h2>
      <Button variant='solid' color='primary' onClick={() => reset()}>
        Try again
      </Button>
    </main>
  );
}

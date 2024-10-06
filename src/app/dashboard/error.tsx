'use client';

import { useEffect } from 'react';
import { BaseButton } from '../ui/buttons';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className='flex h-full flex-col items-center justify-center gap-3'>
      <h2 className='text-center'>Something went wrong!</h2>
      <BaseButton
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </BaseButton>
    </main>
  );
}

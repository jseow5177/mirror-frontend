'use client';

import { createTrialAccount } from '@/app/_lib/action/account';
import { sleep } from '@/app/_lib/utils';
import { Alert, Button, Progress } from '@heroui/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import PacmanLoader from 'react-spinners/PacmanLoader';

export default function TrialAccountForm({ token }: { token: string }) {
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function callAPI() {
      await sleep(1000);

      const state = await createTrialAccount(token);

      if (state.error) {
        setError(state.error);
      } else {
        redirect('/dashboard');
      }
    }
    callAPI();
  }, [retryCount, token]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((v) => (v + 10 > 90 ? 99 : v + 10));
    }, 2000);

    return () => clearInterval(interval);
  }, [retryCount, token]);

  const retry = async () => {
    setProgress(0);
    setError('');
    setRetryCount(retryCount + 1);
  };

  return (
    <>
      {error === '' ? (
        <div className='flex-col'>
          <div className='flex items-center gap-4'>
            <p className='text-xl'>Setting up your trial account</p>
            <p className='text-md'>This might take a few minutes...</p>
            <PacmanLoader color='#2463EB' size={15} />
          </div>
          <div className='mt-6 flex-col'>
            <Progress
              aria-label='Setting up...'
              className='max-w-md'
              color='primary'
              size='md'
              value={progress}
            />
            <p className='text mt-2'>{progress}%</p>
          </div>
        </div>
      ) : (
        <div className='w-[30rem]'>
          <Alert
            color='danger'
            endContent={
              <Button color='danger' size='md' variant='flat' onPress={retry}>
                Retry
              </Button>
            }
            title={error}
          />
        </div>
      )}
    </>
  );
}

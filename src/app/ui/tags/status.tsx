import React from 'react';
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { TagStatus } from '@/app/lib/model';

export default function Status({ status }: { status: number }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': status === TagStatus.Pending,
          'bg-green-600 text-white': status === TagStatus.Normal,
        }
      )}
    >
      {status === TagStatus.Pending ? (
        <>
          Pending
          <ClockIcon className='ml-1 w-4 text-gray-500' />
        </>
      ) : null}
      {status === TagStatus.Normal ? (
        <>
          Normal
          <CheckIcon className='ml-1 w-4 text-white' />
        </>
      ) : null}
    </span>
  );
}

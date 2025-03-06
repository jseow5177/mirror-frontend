import { Spinner } from '@heroui/react';

export default function BaseLoading() {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Spinner size='lg' color='primary' />
    </div>
  );
}

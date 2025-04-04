import { Button, Link, ButtonGroup } from '@heroui/react';
import { PlusIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Segment } from '@/app/_lib/model/segment';

export function CreateSegment() {
  return (
    <Button
      href='/dashboard/segments/create'
      as={Link}
      color='primary'
      variant='solid'
      startContent={<PlusIcon className='h-8' />}
    >
      Create Segment
    </Button>
  );
}

export function ViewSegment({ id }: { id: number }) {
  return (
    <Button
      isIconOnly
      variant='bordered'
      as={Link}
      href={`/dashboard/segments/${id}`}
    >
      <EyeIcon className='h-5' />
    </Button>
  );
}

export function SegmentActions({ segment }: { segment: Segment }) {
  return (
    <ButtonGroup>
      <ViewSegment id={segment.id || 0} />
    </ButtonGroup>
  );
}

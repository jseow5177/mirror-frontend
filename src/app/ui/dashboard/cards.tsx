import React from 'react';
import { UserGroupIcon, TagIcon } from '@heroicons/react/24/outline';
import { countTotalTags } from '@/app/lib/data/tag-data';
import { countTotalSegments } from '@/app/lib/data/segment-data';
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Skeleton,
} from '@nextui-org/react';

export async function NumberOfTagsCard() {
  //const numberOfTags = await countTotalTags();
  return <DashboardCard title='Number of Tags' body={`${0}`} Icon={TagIcon} />;
}

export async function NumberOfSegmentsCard() {
  //const numberOfSegments = await countTotalSegments();
  return (
    <DashboardCard
      title='Number of Segments'
      body={`${0}`}
      Icon={UserGroupIcon}
    />
  );
}

function DashboardCard({
  title,
  body,
  Icon,
}: {
  title: string;
  body: string;
  Icon?: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className='flex gap-4'>
        {Icon && <Icon className='h-5 w-5 text-gray-700' />}
        <p>{title}</p>
      </CardHeader>
      <Divider />
      <CardBody className='flex items-center justify-center'>
        <p className='text-3xl'>{body}</p>
      </CardBody>
    </Card>
  );
}

export function DashboardCardSkeleton() {
  return (
    <Card>
      <CardBody className='flex items-center justify-center'>
        <Skeleton className='h-3 w-3/5 rounded-lg' />
      </CardBody>
    </Card>
  );
}

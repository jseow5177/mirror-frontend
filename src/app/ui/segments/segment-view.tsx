'use client';

import { Segment, Tag } from '@/app/lib/model';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from '@nextui-org/react';
import { CriteriaView } from './criteria';

export default function SegmentView({
  segment,
  tags,
}: {
  segment: Segment;
  tags: Array<Tag>;
}) {
  return (
    <Card className='w-full'>
      <CardHeader className='flex justify-between'>
        <div className='flex flex-col items-start gap-2'>
          <h1 className='text-xl'>{segment.segment_name}</h1>
          <p className='text-sm text-default-500'>
            Segment ID: {segment.segment_id}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{segment.segment_desc}</p>
      </CardBody>
      <Divider />
      <CardFooter className='flex flex-col items-center gap-2'>
        <CriteriaView criteria={segment.criteria} tags={tags} />
      </CardFooter>
    </Card>
  );
}

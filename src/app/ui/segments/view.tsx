import { Segment } from '@/app/lib/model/segment';
import { Tag } from '@/app/lib/model/tag';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Chip,
} from '@nextui-org/react';
import { CriteriaView } from './criteria';

export default async function SegmentView({
  segment,
  tags,
}: {
  segment: Segment;
  tags: Tag[];
}) {
  return (
    <Card className='w-full'>
      <CardHeader className='flex justify-between'>
        <div className='flex flex-col items-start gap-2'>
          <h1 className='text-xl'>{''}</h1>
          <p className='text-sm text-default-500'>Segment ID: 0</p>
        </div>
        <Chip size='lg' color='primary'>
          Count: 0
        </Chip>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{''}</p>
      </CardBody>
      <Divider />
      <CardFooter className='flex flex-col items-center gap-2'>
        <CriteriaView criteria={''} tags={tags} />
      </CardFooter>
    </Card>
  );
}

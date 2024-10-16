import { Segment, Tag } from '@/app/lib/model';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Chip,
} from '@nextui-org/react';
import { CriteriaView } from './criteria';
import { getCriteriaCount } from '@/app/lib/segment-data';

export default async function SegmentView({
  segment,
  tags,
}: {
  segment: Segment;
  tags: Array<Tag>;
}) {
  const fetchTaskData = async () => {
    const [count] = await Promise.all([getCriteriaCount(segment.criteria)]);

    return {
      count,
    };
  };

  const { count } = await fetchTaskData();

  console.log(count);

  return (
    <Card className='w-full'>
      <CardHeader className='flex justify-between'>
        <div className='flex flex-col items-start gap-2'>
          <h1 className='text-xl'>{segment.segment_name}</h1>
          <p className='text-sm text-default-500'>
            Segment ID: {segment.segment_id}
          </p>
        </div>
        <Chip size='lg' color='primary'>
          Count: {count}
        </Chip>
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

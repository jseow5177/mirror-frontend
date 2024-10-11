'use client';

import { Tag, TagValueType } from '@/app/lib/model';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
} from '@nextui-org/react';

import DragAndDrop from './file-drop';
import TagValueTypeChip from './value_type';

const csvFiles: Record<TagValueType, string> = {
  [TagValueType.Str]: '/files/str/sample.csv',
  [TagValueType.Int]: '/files/int/sample.csv',
  [TagValueType.Float]: '/files/float/sample.csv',
};

const txtFiles: Record<TagValueType, string> = {
  [TagValueType.Str]: '/files/str/text.csv',
  [TagValueType.Int]: '/files/int/sample.txt',
  [TagValueType.Float]: '/files/float/sample.txt',
};

export default function TagView({ tag }: { tag: Tag }) {
  console.log(csvFiles[tag.tag_value_type]);
  return (
    <Card className='w-[500px]'>
      <CardHeader className='flex justify-between'>
        <div className='flex flex-col items-start gap-2'>
          <h1 className='text-xl'>{tag.tag_name}</h1>
          <p className='text-sm text-default-500'>Tag ID: {tag.tag_id}</p>
        </div>
        <div className='flex flex-col items-end gap-2'>
          <TagValueTypeChip tagValueType={tag.tag_value_type} />
          {tag.tag_value_type === TagValueType.Float && (
            <p className='text-xs text-red-500'>(Max 5 decimal places)</p>
          )}
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{tag.tag_desc}</p>
      </CardBody>
      <Divider />
      <CardFooter className='flex flex-col items-center gap-2'>
        <DragAndDrop tag={tag} />
        <p className='text-small text-default-500'>
          Only .csv or .txt file are accepted
        </p>
        <div className='flex gap-3'>
          <Link href={csvFiles[tag.tag_value_type]} size='sm'>
            sample.csv
          </Link>
          <Link href={txtFiles[tag.tag_value_type]} size='sm'>
            sample.txt
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

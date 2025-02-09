'use client';

import { Tag, TagValueTypes } from '@/app/_lib/model/tag';
import { Task } from '@/app/_lib/model/task';
import { convertUnixToLocalTime } from '@/app/_lib/utils';
import TaskTable from './task-table';
import BasePagination from '../pagination';
import { Divider, Tab, Tabs } from '@nextui-org/react';
import { DetailGrid, DetailRow } from '../detail';

export default function TagView({
  tag,
  tasks,
  totalTasks,
}: {
  tag: Tag;
  tasks: Task[];
  totalTasks: number;
}) {
  const tagCreateTime = convertUnixToLocalTime(tag.create_time);
  const tagUpdateTime = convertUnixToLocalTime(tag.update_time);

  return (
    <>
      <DetailGrid>
        <DetailRow label='Name' value={tag.name} />
        <DetailRow label='Description' value={tag.tag_desc} />
        <DetailRow label='Value Type' value={TagValueTypes[tag.value_type]} />
        <DetailRow
          label='Create Time'
          value={`${tagCreateTime.date}, ${tagCreateTime.time}`}
        />
        <DetailRow
          label='Update Time'
          value={`${tagUpdateTime.date}, ${tagUpdateTime.time}`}
        />
      </DetailGrid>
      <Divider className='my-8' />
      <Tabs
        aria-label='tag-data'
        color='primary'
        size='lg'
        variant='bordered'
        radius='sm'
      >
        <Tab key='tasks' title='Tasks'>
          <TaskTable tasks={tasks || []} />
        </Tab>
      </Tabs>
      <div className='mt-5 flex w-full justify-end'>
        <BasePagination totalPages={totalTasks} />
      </div>
    </>
  );
}

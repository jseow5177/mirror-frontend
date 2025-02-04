'use client';

import { Tag, TagValueTypes } from '@/app/_lib/model/tag';
import { Task } from '@/app/_lib/model/task';
import { convertUnixToLocalTime } from '@/app/_lib/utils';
import TaskTable from './task-table';
import BasePagination from '../pagination';
import { Divider, Tab, Tabs } from '@nextui-org/react';
import LogTable from './log-table';

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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '200px auto',
          rowGap: '16px',
        }}
      >
        <p>
          <strong>Name:</strong>
        </p>
        <p>{tag.name}</p>

        <p>
          <strong>Description:</strong>
        </p>
        <p>{tag.tag_desc}</p>

        <p>
          <strong>Tag Value Type:</strong>
        </p>
        <p>{TagValueTypes[tag.value_type]}</p>

        <p>
          <strong>Create Time:</strong>
        </p>
        <p>
          {tagCreateTime.date}, {tagCreateTime.time}
        </p>

        <p>
          <strong>Update Time:</strong>
        </p>
        <p>
          {tagUpdateTime.date}, {tagUpdateTime.time}
        </p>
      </div>
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

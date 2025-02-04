'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@nextui-org/react';
import { Task, TaskStatus, TaskStatuses } from '@/app/_lib/model/task';
import { ChipColors } from '../utils';
import { convertUnixToLocalTime } from '@/app/_lib/utils';

const statusColors: Record<TaskStatus, ChipColors> = {
  [TaskStatus.Pending]: 'default',
  [TaskStatus.Running]: 'primary',
  [TaskStatus.Success]: 'success',
  [TaskStatus.Failed]: 'danger',
};

export default async function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
    <Table aria-label='task-table'>
      <TableHeader>
        <TableColumn>Task ID</TableColumn>
        <TableColumn>File Name</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Size</TableColumn>
        <TableColumn>Progress</TableColumn>
        <TableColumn>Create Time</TableColumn>
        <TableColumn>Update Time</TableColumn>
      </TableHeader>
      <TableBody emptyContent={'No tasks to display.'}>
        {tasks.map((task, i) => {
          const { date: createDate, time: createTime } = convertUnixToLocalTime(
            task.create_time
          );
          const { date: updateDate, time: updateTime } = convertUnixToLocalTime(
            task.update_time
          );
          return (
            <TableRow key={i}>
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.ext_info.ori_file_name || ''}</TableCell>
              <TableCell>
                <Chip color={statusColors[task.status]}>
                  {TaskStatuses[task.status]}
                </Chip>
              </TableCell>
              <TableCell>{task.ext_info.size || 0}</TableCell>
              <TableCell>{task.ext_info.progress || 0}</TableCell>
              <TableCell>
                <p>{createDate}</p>
                <p className='mt-1 text-xs'>{createTime}</p>
              </TableCell>
              <TableCell>
                <p>{updateDate}</p>
                <p className='mt-1 text-xs'>{updateTime}</p>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

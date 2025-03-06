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
  CircularProgress,
} from '@heroui/react';
import { Task, TaskStatus, TaskStatuses } from '@/app/_lib/model/task';
import { ChipColors } from '../utils';
import { convertUnixToLocalTime } from '@/app/_lib/utils';

const statusColors: Record<TaskStatus, ChipColors> = {
  [TaskStatus.Pending]: 'default',
  [TaskStatus.Running]: 'primary',
  [TaskStatus.Success]: 'success',
  [TaskStatus.Failed]: 'danger',
};

export default function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
    <Table aria-label='task-table'>
      <TableHeader>
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
              <TableCell>{task.ext_info.ori_file_name || ''}</TableCell>
              <TableCell>
                <Chip color={statusColors[task.status]}>
                  {TaskStatuses[task.status]}
                </Chip>
              </TableCell>
              <TableCell>{task.ext_info.size || 0}</TableCell>
              <TableCell>
                <CircularProgress
                  aria-label='Task progress'
                  color={task.ext_info.progress === 100 ? 'success' : 'primary'}
                  showValueLabel
                  value={task.ext_info.progress}
                />
              </TableCell>
              <TableCell>
                <p>{createDate}</p>
                <p className='mt-2 text-xs'>{createTime}</p>
              </TableCell>
              <TableCell>
                <p>{updateDate}</p>
                <p className='mt-2 text-xs'>{updateTime}</p>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

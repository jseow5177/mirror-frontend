'use client';

import React from 'react';
import BaseChip from '../chip';
import { convertUnixToLocalTime } from '@/app/lib/utils';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import { Task } from '@/app/lib/model';

export default async function TaskTable({ tasks }: { tasks: Array<Task> }) {
  return (
    <Table aria-label='task-table'>
      <TableHeader>
        <TableColumn>Task ID</TableColumn>
        <TableColumn>File</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Create Time</TableColumn>
        <TableColumn>Update Time</TableColumn>
      </TableHeader>
      <TableBody emptyContent={'No tasks to display.'}>
        {tasks.map((task, i) => (
          <TableRow key={i}>
            <TableCell>{task.task_id}</TableCell>
            <TableCell>Link</TableCell>
            <TableCell>
              <BaseChip label={task.task_status} labelType='taskStatus' />
            </TableCell>
            <TableCell>{convertUnixToLocalTime(task.create_time)}</TableCell>
            <TableCell>{convertUnixToLocalTime(task.update_time)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

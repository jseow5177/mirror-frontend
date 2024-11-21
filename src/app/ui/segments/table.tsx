'use client';

import React from 'react';
import { convertUnixToLocalTime } from '@/app/lib/utils';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@nextui-org/react';
import {
  Segment,
  SegmentStatus,
  SegmentStatuses,
} from '@/app/lib/model/segment';
import { SegmentActions } from './buttons';
import { ChipColors } from '../utils';

const statusColors: Record<SegmentStatus, ChipColors> = {
  [SegmentStatus.Normal]: 'success',
  [SegmentStatus.Deleted]: 'danger',
};

export default function SegmentTable({ segments }: { segments: Segment[] }) {
  return (
    <Table aria-label='tag-table'>
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Description</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Create Time</TableColumn>
        <TableColumn>Update Time</TableColumn>
        <TableColumn> </TableColumn>
      </TableHeader>
      <TableBody emptyContent={'No segments to display.'}>
        {segments.map((segment, i) => {
          const { date: updateDate, time: updateTime } = convertUnixToLocalTime(
            segment.update_time
          );
          const { date: createDate, time: createTime } = convertUnixToLocalTime(
            segment.create_time
          );
          return (
            <TableRow key={i}>
              <TableCell className='w-[20%]'>{segment.name}</TableCell>
              <TableCell className='w-[30%]'>{segment.desc}</TableCell>
              <TableCell className='w-[10%]'>
                <Chip color={statusColors[segment.status]}>
                  {SegmentStatuses[segment.status]}
                </Chip>
              </TableCell>
              <TableCell className='w-[15%]'>
                <p>{createDate}</p>
                <p className='mt-1 text-xs'>{createTime}</p>
              </TableCell>
              <TableCell className='w-[15%]'>
                <p>{updateDate}</p>
                <p className='mt-1 text-xs'>{updateTime}</p>
              </TableCell>
              <TableCell className='w-[10%]'>
                <SegmentActions segment={segment} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

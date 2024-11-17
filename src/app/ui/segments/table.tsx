'use client';

import React from 'react';
import { convertUnixToLocalTime } from '@/app/lib/utils';
import BaseChip from '../chip';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import { Segment } from '@/app/lib/model';
import { SegmentActions } from './buttons';

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
                <BaseChip label={segment.status} labelType='segmentStatus' />
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

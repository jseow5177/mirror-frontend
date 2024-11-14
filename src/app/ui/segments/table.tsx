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
        {segments.map((segment, i) => (
          <TableRow key={i}>
            <TableCell>{segment.segment_name}</TableCell>
            <TableCell>{segment.segment_desc}</TableCell>
            <TableCell>
              <BaseChip
                label={segment.segment_status}
                labelType='segmentStatus'
              />
            </TableCell>
            <TableCell>{convertUnixToLocalTime(segment.create_time)}</TableCell>
            <TableCell>{convertUnixToLocalTime(segment.update_time)}</TableCell>
            <TableCell>
              <SegmentActions segment={segment} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

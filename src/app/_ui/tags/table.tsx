'use client';

import React from 'react';
import { convertUnixToLocalTime } from '@/app/_lib/utils';
import { TagActions } from './buttons';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@nextui-org/react';
import { Tag, TagStatus, TagStatuses } from '@/app/_lib/model/tag';
import { ChipColors } from '../utils';

const statusColors: Record<TagStatus, ChipColors> = {
  [TagStatus.Normal]: 'success',
  [TagStatus.Deleted]: 'danger',
};

export default function TagTable({ tags }: { tags: Tag[] }) {
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
      <TableBody emptyContent={'No tags to display.'}>
        {tags.map((tag, i) => {
          const { date: updateDate, time: updateTime } = convertUnixToLocalTime(
            tag.update_time
          );
          const { date: createDate, time: createTime } = convertUnixToLocalTime(
            tag.create_time
          );
          return (
            <TableRow key={i}>
              <TableCell className='w-[20%]'>{tag.name}</TableCell>
              <TableCell className='w-[30%]'>{tag.tag_desc}</TableCell>
              <TableCell className='w-[10%]'>
                <Chip color={statusColors[tag.status]}>
                  {TagStatuses[tag.status]}
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
                <TagActions tag={tag} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

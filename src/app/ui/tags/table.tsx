'use client';

import React from 'react';
import BaseChip from '../chip';
import { convertUnixToLocalTime } from '@/app/lib/utils';
import { TagActions } from './buttons';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import { Tag } from '@/app/lib/model/tag';

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
              <TableCell className='w-[30%]'>{tag.desc}</TableCell>
              <TableCell className='w-[10%]'>
                <BaseChip label={tag.status} labelType='tagStatus' />
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

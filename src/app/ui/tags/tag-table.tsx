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

export default function TagTable({ tags }: { tags: Array<Tag> }) {
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
        {tags.map((tag, i) => (
          <TableRow key={i}>
            <TableCell>{tag.name}</TableCell>
            <TableCell>{tag.desc}</TableCell>
            <TableCell>
              <BaseChip label={tag.status} labelType='tagStatus' />
            </TableCell>
            <TableCell>{convertUnixToLocalTime(tag.create_time)}</TableCell>
            <TableCell>{convertUnixToLocalTime(tag.update_time)}</TableCell>
            <TableCell>
              <TagActions tag={tag} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

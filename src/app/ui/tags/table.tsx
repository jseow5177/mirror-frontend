'use client';

import React from 'react';
import Status from './status';
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
import { Tag } from '@/app/lib/model';

export default function BaseTable({ tags }: { tags: Array<Tag> }) {
  return (
    <Table>
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Description</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Create Time</TableColumn>
        <TableColumn>Update Time</TableColumn>
        <TableColumn> </TableColumn>
      </TableHeader>
      <TableBody>
        {tags.map((tag, i) => (
          <TableRow key={i}>
            <TableCell>{tag.tag_name}</TableCell>
            <TableCell>{tag.tag_desc}</TableCell>
            <TableCell>
              <Status status={tag.tag_status} />
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

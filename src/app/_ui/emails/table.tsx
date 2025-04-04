'use client';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@heroui/react';
import { convertUnixToLocalTime } from '@/app/_lib/utils';
import { Email, EmailStatus, EmailStatuses } from '@/app/_lib/model/email';
import { ChipColors } from '../utils';
import { EmailActions } from './buttons';

const statusColors: Record<EmailStatus, ChipColors> = {
  [EmailStatus.Normal]: 'success',
  [EmailStatus.Deleted]: 'danger',
};

export default function EmailTable({ emails }: { emails: Email[] }) {
  return (
    <Table aria-label='email-table'>
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Description</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Create Time</TableColumn>
        <TableColumn>Update Time</TableColumn>
        <TableColumn> </TableColumn>
      </TableHeader>
      <TableBody emptyContent='You have no emails.'>
        {emails.map((email, i) => {
          const { date: updateDate, time: updateTime } = convertUnixToLocalTime(
            email.update_time
          );
          const { date: createDate, time: createTime } = convertUnixToLocalTime(
            email.create_time
          );
          return (
            <TableRow key={i}>
              <TableCell className='w-[20%]'>{email.name}</TableCell>
              <TableCell className='w-[30%]'>{email.email_desc}</TableCell>
              <TableCell className='w-[10%]'>
                <Chip color={statusColors[email.status]}>
                  {EmailStatuses[email.status]}
                </Chip>
              </TableCell>
              <TableCell className='w-[15%]'>
                <p>{createDate}</p>
                <p className='mt-2 text-xs'>{createTime}</p>
              </TableCell>
              <TableCell className='w-[15%]'>
                <p>{updateDate}</p>
                <p className='mt-2 text-xs'>{updateTime}</p>
              </TableCell>
              <TableCell className='w-[10%]'>
                <EmailActions email={email} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

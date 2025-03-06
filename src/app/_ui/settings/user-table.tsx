'use client';

import { User, UserStatus, UserStatuses } from '@/app/_lib/model/user';
import { ChipColors } from '../utils';
import {
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { convertUnixToLocalTime } from '@/app/_lib/utils';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useState } from 'react';

const statusColors: Record<UserStatus, ChipColors> = {
  [UserStatus.Normal]: 'success',
  [UserStatus.Pending]: 'default',
  [UserStatus.Deleted]: 'danger',
};

export default function UserTable({ users }: { users: User[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFilter = useDebouncedCallback(
    (field: string, values: string[]) => {
      const params = new URLSearchParams(searchParams);
      if (values.length > 0) {
        params.set('page', '1');
        params.set(field, values.join(','));
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    300
  );

  const getStatusFilter = useCallback(() => {
    return (
      searchParams.get('status')?.split(',') ?? [
        UserStatuses[UserStatus.Pending],
        UserStatuses[UserStatus.Normal],
        UserStatuses[UserStatus.Deleted],
      ]
    );
  }, [searchParams]);

  const [statusFilter, setStatusFilter] = useState(getStatusFilter());

  useEffect(() => {
    setStatusFilter(getStatusFilter());
  }, [searchParams, getStatusFilter]);

  return (
    <Table aria-label='user-table'>
      <TableHeader>
        <TableColumn>Username</TableColumn>
        <TableColumn>Role</TableColumn>
        <TableColumn className='flex items-center gap-2'>
          <p>Status</p>
          <Dropdown>
            <DropdownTrigger>
              <FunnelIcon className='h-4 cursor-pointer' />
            </DropdownTrigger>
            <DropdownMenu
              selectedKeys={new Set(statusFilter)}
              closeOnSelect={false}
              disallowEmptySelection
              selectionMode='multiple'
              onSelectionChange={(keys) => {
                const newStatusFilter = Array.from(keys) as string[];
                setStatusFilter(newStatusFilter);
                handleFilter('status', newStatusFilter);
              }}
            >
              {Object.keys(UserStatuses).map((userStatus) => {
                const v = Number(userStatus) as UserStatus;
                return (
                  <DropdownItem key={UserStatuses[v]}>
                    {UserStatuses[v]}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </Dropdown>
        </TableColumn>
        <TableColumn>Joined Date</TableColumn>
      </TableHeader>
      <TableBody emptyContent={'No users to display.'}>
        {users.map((user, i) => {
          const { date: createDate, time: createTime } = convertUnixToLocalTime(
            user.create_time
          );
          return (
            <TableRow key={i}>
              <TableCell className='w-[30%]'>
                <p>{user.username}</p>
                <p className='mt-2 text-xs'>{user.email}</p>
              </TableCell>
              <TableCell className='w-[15%]'>
                <Chip color='primary' variant='bordered'>
                  {user.role.name}
                </Chip>
              </TableCell>
              <TableCell className='w-[15%]'>
                <Chip color={statusColors[user.status]}>
                  {UserStatuses[user.status]}
                </Chip>
              </TableCell>
              <TableCell className='w-[20%]'>
                <p>{createDate}</p>
                <p className='mt-2 text-xs'>{createTime}</p>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

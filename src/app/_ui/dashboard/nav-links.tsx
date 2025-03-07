'use client';

import React from 'react';
import {
  UserGroupIcon,
  HomeIcon,
  TagIcon,
  InboxIcon,
  SpeakerWaveIcon,
  ArrowLeftStartOnRectangleIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Button, Link } from '@heroui/react';
import { logOut } from '@/app/_lib/action/user';

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Tags',
    href: '/dashboard/tags',
    icon: TagIcon,
  },
  {
    name: 'Segments',
    href: '/dashboard/segments',
    icon: UserGroupIcon,
  },
  {
    name: 'Emails',
    href: '/dashboard/emails',
    icon: InboxIcon,
  },
  {
    name: 'Campaigns',
    href: '/dashboard/campaigns',
    icon: SpeakerWaveIcon,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings/users',
    icon: Cog6ToothIcon,
    highlightOnPrefix: '/dashboard/settings',
  },
  {
    name: 'Feedback',
    href: 'https://forms.gle/VmejJj29a3RHbaTo9',
    icon: ChatBubbleLeftIcon,
    isExternal: true,
  },
];

const navStyle = `flex h-[58px] items-center justify-start gap-2 
rounded-md bg-gray-50 p-4 font-medium hover:bg-sky-100 hover:text-blue-600 text-inherit`;

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            isExternal={link.isExternal}
            key={link.name}
            href={link.href}
            className={clsx(navStyle, {
              'bg-sky-100 text-blue-600':
                pathname === link.href ||
                (link.highlightOnPrefix &&
                  pathname.startsWith(link.highlightOnPrefix)),
            })}
          >
            <LinkIcon className='w-6' />
            <p className='block'>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

export function LogOutButton() {
  const logOutUser = async () => {
    await logOut();
  };
  return (
    <Button
      startContent={<ArrowLeftStartOnRectangleIcon className='w-6' />}
      className={navStyle}
      onPress={logOutUser}
    >
      Log Out
    </Button>
  );
}

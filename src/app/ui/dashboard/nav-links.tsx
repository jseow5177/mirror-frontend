'use client';

import React from 'react';
import { UserGroupIcon, HomeIcon, TagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

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
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] flex-none items-center justify-start gap-2 rounded-md bg-gray-50 p-2 px-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              }
            )}
          >
            <LinkIcon className='w-6' />
            <p className='block'>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

'use client';

import { Link, ScrollShadow } from '@heroui/react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    name: 'General',
    href: '/dashboard/settings/general',
  },
  {
    name: 'Users',
    href: '/dashboard/settings/users',
  },
  {
    name: 'Roles',
    href: '/dashboard/settings/roles',
  },
  {
    name: 'Email',
    href: '/dashboard/settings/email',
  },
];
const menuStyle = `flex h-[50px] items-center justify-start rounded-sm p-4 hover:bg-gray-100 text-inherit`;

export default function SideBar() {
  const pathname = usePathname();

  return (
    <ScrollShadow
      hideScrollBar
      className='min-h-[80vh] w-[15rem] flex-col space-y-2 overflow-y-auto border-r-2 pr-6'
    >
      {menuItems.map((item, i) => (
        <Link
          key={i}
          href={item.href}
          className={clsx(menuStyle, {
            'bg-gray-100': item.href === pathname,
          })}
        >
          {item.name}
        </Link>
      ))}
    </ScrollShadow>
  );
}

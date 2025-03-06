'use client';

import { Link, ScrollShadow } from '@heroui/react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    name: 'Users',
    href: '/dashboard/settings/users',
  },
  {
    name: 'Roles',
    href: '/dashboard/settings/roles',
  },
];
const menuStyle = `flex h-[52px] items-center justify-start rounded-sm p-4 hover:bg-gray-100 text-inherit`;

export default function SideBar() {
  const pathname = usePathname();

  return (
    <ScrollShadow
      hideScrollBar
      className='h-[80vh] w-[15rem] flex-col space-y-2 overflow-y-auto border-r-2 pr-6'
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

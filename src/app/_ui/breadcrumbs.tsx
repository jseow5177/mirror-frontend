'use client';

import { Breadcrumbs, BreadcrumbItem } from '@heroui/react';

interface Breadcrumb {
  label: string;
  href: string;
  isCurrent?: boolean;
}

export default function BaseBreadcrumbs({
  breadcrumbs,
  separator = '/',
}: {
  breadcrumbs: Breadcrumb[];
  separator?: string;
}) {
  return (
    <Breadcrumbs
      size='lg'
      underline='active'
      className='mb-8'
      separator={separator}
    >
      {breadcrumbs.map((breadcrumb, i) => (
        <BreadcrumbItem
          href={breadcrumb.href}
          key={i}
          isCurrent={breadcrumb.isCurrent}
        >
          {breadcrumb.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}

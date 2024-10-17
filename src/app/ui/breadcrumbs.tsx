'use client';

import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/react';

interface Breadcrumb {
  label: string;
  href: string;
  isCurrent?: boolean;
}

export default function BaseBreadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <Breadcrumbs size='lg' underline='active' className='mb-8'>
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

'use client';

import { Pagination } from '@heroui/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function BasePagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination
      showControls
      total={totalPages}
      initialPage={1}
      isCompact
      onChange={(page) => {
        router.push(createPageURL(page));
      }}
    />
  );
}

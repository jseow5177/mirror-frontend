'use client';

import { Pagination } from '@heroui/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BasePagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const updatePageParam = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    setPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  return (
    <>
      {!!totalPages && (
        <Pagination
          showControls
          total={totalPages}
          page={page > totalPages ? totalPages : page}
          isCompact
          onChange={updatePageParam}
        />
      )}
    </>
  );
}

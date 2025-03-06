'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@heroui/react';

export default function SearchBar({ placeholder }: { placeholder: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    router.push(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Input
      variant='bordered'
      fullWidth
      defaultValue={searchParams.get('query')?.toString()}
      startContent={<MagnifyingGlassIcon className='w-5' />}
      labelPlacement='outside'
      placeholder={placeholder}
      onChange={(e) => {
        handleSearch(e.target.value);
      }}
    />
  );
}

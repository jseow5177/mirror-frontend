import { CreateEmail } from '@/app/ui/emails/buttons';
import { getEmails } from '@/app/lib/email-data';
import EmailTable from '@/app/ui/emails/table';
import BasePagination from '@/app/ui/pagination';
import SearchBar from '@/app/ui/search-bar';
import React from 'react';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const fetchTagData = async () => {
    const [resp] = await Promise.all([getEmails(currentPage, query)]);

    return {
      resp,
    };
  };

  const { resp } = await fetchTagData();

  return (
    <main className='w-full'>
      <h1 className='mb-8 text-2xl'>Segments</h1>
      <div className='mb-5 flex items-center justify-between gap-2'>
        <SearchBar placeholder='Search segments...' />
        <CreateEmail />
      </div>
      <EmailTable emails={resp[0].emails || []} />
      <div className='mt-5 flex w-full justify-end'>
        <BasePagination totalPages={resp[1]} />
      </div>
    </main>
  );
}

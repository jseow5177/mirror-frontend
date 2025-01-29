import { CreateEmail } from '@/app/_ui/emails/buttons';
import { getEmails } from '@/app/_lib/data/email';
import EmailTable from '@/app/_ui/emails/table';
import BasePagination from '@/app/_ui/pagination';
import SearchBar from '@/app/_ui/search-bar';
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
      <h1 className='mb-8 text-2xl'>Emails</h1>
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

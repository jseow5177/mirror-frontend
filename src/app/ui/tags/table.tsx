import React from 'react';
import { useState } from 'react';
import { getTags } from '@/app/lib/data';
import Status from './status';
import { convertUnixToLocalTime } from '@/app/lib/utils';
import { DeleteTag, UpdateTag } from './buttons';
import Modal from '../modal';

export default async function Table({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const tags = await getTags(query, currentPage);

  return (
    <div className='mt-6 flow-root'>
      <div className='inline-block min-w-full align-middle'>
        <div className='rounded-lg bg-gray-50 p-2 pt-0'>
          <table className='table min-w-full text-gray-900'>
            <thead className='rounded-lg text-left text-sm font-normal'>
              <tr>
                <th scope='col' className='px-4 py-5 pl-6 font-medium'>
                  Name
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Description
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Status
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Create Time
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Update Time
                </th>
                <th scope='col' className='relative py-3 pl-6 pr-3'>
                  <span className='sr-only'>Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {tags?.map((tag) => (
                <tr
                  key={tag.tag_id}
                  className='w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg'
                >
                  <td className='whitespace-nowrap py-3 pl-6 pr-3'>
                    <div className='flex items-center gap-3'>
                      <p>{tag.tag_name}</p>
                    </div>
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    {tag.tag_desc}
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    <Status status={tag.tag_status} />
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    {convertUnixToLocalTime(tag.create_time)}
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    {convertUnixToLocalTime(tag.update_time)}
                  </td>
                  <td className='whitespace-nowrap py-3 pl-6 pr-3'>
                    <div className='flex justify-end gap-3'>
                      <UpdateTag id={tag.tag_id} />
                      <DeleteTag id={tag.tag_id} name={tag.tag_name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

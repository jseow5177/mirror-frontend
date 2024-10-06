'use client';

import React, { useState } from 'react';
import { createTag, TagState, updateTag } from '@/app/lib/action';
import { Tag, TagValueType } from '@/app/lib/model';
import {
  DocumentTextIcon,
  TagIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { BaseButton, ButtonColors, LinkButton } from '../buttons';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useActionState } from 'react';
import { redirect } from 'next/navigation';
import { Tooltip } from '@nextui-org/react';

function BaseTooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  return (
    <Tooltip content={content} placement='bottom' color='primary' showArrow>
      {children}
    </Tooltip>
  );
}

export default function TagForm({ tag }: { tag?: Tag }) {
  let isUpdate = false;
  if (tag) {
    isUpdate = true;
  }

  const initialState: TagState = {
    message: null,
    fieldErrors: {},
    error: null,
    payload: null,
  };
  const [state, formAction, pending] = useActionState(
    !isUpdate ? createTag : updateTag,
    initialState
  );

  useEffect(() => {
    if (!state.fieldErrors) {
      if (state.error) {
        toast.error(state.message ? state.message : 'Error encountered');
      } else if (state.message) {
        toast.success(state.message);
        redirect('/dashboard/tags');
      }
    }
  }, [state]);

  return (
    <form className='w-1/2' action={formAction}>
      <div className='rounded-md bg-gray-50 p-6'>
        {/* Tag ID */}
        {isUpdate && (
          <>
            <label htmlFor='tagID' className='hidden'>
              Tag ID
            </label>
            <input
              id='tagID'
              name='tagID'
              className='hidden'
              defaultValue={
                (state.payload?.get('tagID') as string) || tag?.tag_id
              }
              readOnly
            />
          </>
        )}

        {/* Tag Name */}
        <div className='mb-4'>
          <div className='mb-2 flex items-center gap-2'>
            <TagIcon className='pointer-events-none h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900' />
            <label htmlFor='tagName' className='block text-base font-medium'>
              Tag Name
            </label>
          </div>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input
                id='tagName'
                name='tagName'
                placeholder='Enter tag name'
                className='peer block w-full rounded-md border border-gray-200 p-3 text-sm outline-2 placeholder:text-gray-500'
                aria-describedby='tagName-error'
                defaultValue={
                  (state.payload?.get('tagName') as string) || tag?.tag_name
                }
                maxLength={64}
              />
            </div>
            <div id='tagName-error' aria-live='polite' aria-atomic='true'>
              {state.fieldErrors?.tagName &&
                state.fieldErrors.tagName.map((error: string) => (
                  <p className='mt-2 text-sm text-red-500' key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Tag Description */}
        <div className='mb-4'>
          <div className='mb-2 flex items-center gap-2'>
            <DocumentTextIcon className='pointer-events-none h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900' />
            <label htmlFor='tagDesc' className='block text-base font-medium'>
              Tag Description
            </label>
          </div>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <textarea
                id='tagDesc'
                name='tagDesc'
                placeholder='Enter tag description'
                className='peer block w-full resize-none rounded-md border border-gray-200 p-3 text-sm outline-2 placeholder:text-gray-500'
                aria-describedby='tagDesc-error'
                defaultValue={
                  (state.payload?.get('tagDesc') as string) || tag?.tag_desc
                }
                maxLength={120}
                rows={3}
              />
            </div>
            <div id='tagDesc-error' aria-live='polite' aria-atomic='true'>
              {state.fieldErrors?.tagDesc &&
                state.fieldErrors.tagDesc.map((error: string) => (
                  <p className='mt-2 text-sm text-red-500' key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Tag Value Type */}
        {!isUpdate && (
          <fieldset>
            <div className='mb-2 flex items-center gap-2'>
              <ShieldCheckIcon className='pointer-events-none h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900' />
              <legend className='block text-base font-medium'>
                Tag Value Type
              </legend>
            </div>
            <div className='rounded-md border border-gray-200 bg-white px-[14px] py-3'>
              <div className='flex gap-4'>
                <div className='flex items-center'>
                  <input
                    id='str'
                    name='tagValueType'
                    type='radio'
                    value={TagValueType.Str}
                    className='h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2'
                    aria-describedby='status-error'
                  />
                  <BaseTooltip content='Male, SG, ...'>
                    <label
                      htmlFor='str'
                      className='ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600'
                    >
                      Text
                    </label>
                  </BaseTooltip>
                </div>
                <div className='flex items-center'>
                  <input
                    id='int'
                    name='tagValueType'
                    type='radio'
                    value={TagValueType.Int}
                    className='h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2'
                  />
                  <BaseTooltip content='1, 100, ...'>
                    <label
                      htmlFor='int'
                      className='ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600'
                    >
                      Integer
                    </label>
                  </BaseTooltip>
                </div>
                <div className='flex items-center'>
                  <input
                    id='float'
                    name='tagValueType'
                    type='radio'
                    value={TagValueType.Float}
                    className='h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2'
                  />
                  <BaseTooltip content='1.5, 3.142, ...'>
                    <label
                      htmlFor='float'
                      className='ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600'
                    >
                      Decimal
                    </label>
                  </BaseTooltip>
                </div>
              </div>
            </div>
            <div id='status-error' aria-live='polite' aria-atomic='true'>
              {state.fieldErrors?.tagValueType &&
                state.fieldErrors.tagValueType.map((error: string) => (
                  <p className='mt-2 text-sm text-red-500' key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </fieldset>
        )}
      </div>
      <div className='mt-6 flex justify-end gap-4'>
        <LinkButton
          label='Cancel'
          href='/dashboard/tags'
          color={ButtonColors.Warn}
        />
        <BaseButton type='submit' disabled={pending} isPending={pending}>
          {`${isUpdate ? 'Update' : 'Create'}`} Tag
        </BaseButton>
      </div>
    </form>
  );
}

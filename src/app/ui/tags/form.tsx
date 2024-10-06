'use client';

import React from 'react';
import { createTag, TagState, updateTag } from '@/app/lib/action';
import { Tag } from '@/app/lib/model';
import { DocumentTextIcon, TagIcon } from '@heroicons/react/24/outline';
import { useFormState } from 'react-dom';
import { BaseButton, ButtonColors, LinkButton } from '../buttons';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useFormStatus } from 'react-dom';

export default function TagForm({ tag }: { tag?: Tag }) {
  let isUpdate = false;
  if (tag) {
    isUpdate = true;
  }

  const initialState: TagState = {
    message: null,
    fieldErrors: {},
    error: null,
  };
  const [state, formAction] = useFormState(
    isUpdate ? updateTag : createTag,
    initialState
  );

  useEffect(() => {
    if (state.error) {
      toast.error(state.message ? state.message : 'Error encountered');
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
              defaultValue={tag ? tag.tag_id : ''}
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
                defaultValue={tag ? tag.tag_name : ''}
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
                defaultValue={tag ? tag.tag_desc : ''}
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
      </div>
      <div className='mt-6 flex justify-end gap-4'>
        <LinkButton
          label='Cancel'
          href='/dashboard/tags'
          color={ButtonColors.Warn}
        />
        <BaseButton type='submit'>
          {`${isUpdate ? 'Update' : 'Create'}`} Tag
        </BaseButton>
      </div>
    </form>
  );
}

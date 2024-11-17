'use client';

import React, { useState, useEffect } from 'react';
import { Segment } from '@/app/lib/model';
import { Tag } from '@/app/lib/model/tag';
import {
  DocumentTextIcon,
  TagIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { createSegment, SegmentState } from '@/app/lib/segment-action';
import { useActionState } from 'react';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';
import { Link, Button, Input, Textarea, Divider } from '@nextui-org/react';
import { QueryBuilder } from './query-builder';
import clsx from 'clsx';

export default function SegmentForm({
  segment,
  tags,
}: {
  segment?: Segment;
  tags: Tag[];
}) {
  let isUpdate = false;
  if (segment) {
    isUpdate = true;
  }

  const initialState: SegmentState = {
    message: null,
    fieldErrors: {},
    error: null,
  };

  const [segmentFields, setSegmentFields] = useState({
    id: segment?.id ? `${segment?.id}` : '0',
    name: segment?.name || '',
    desc: segment?.desc || '',
    criteria: segment?.criteria || '{}',
  });

  const handleCreateSegment = (s: SegmentState, formData: FormData) => {
    formData.append('criteria', segmentFields.criteria);
    return createSegment(s, formData);
  };

  const [state, formAction, pending] = useActionState(
    handleCreateSegment,
    initialState
  );

  useEffect(() => {
    if (!state.fieldErrors) {
      if (state.error) {
        toast.error(state.error ? state.error : 'Error encountered');
      } else if (state.message) {
        toast.success(state.message);
        redirect('/dashboard/segments');
      }
    } else {
      if (
        !state.fieldErrors.name &&
        !state.fieldErrors.desc &&
        state.fieldErrors.criteria
      ) {
        toast.error('Criteria is incomplete!');
      }
    }

    // keep form state
    setSegmentFields({
      id: segmentFields.id,
      name: segmentFields.name,
      desc: segmentFields.desc,
      criteria: segmentFields.criteria,
    });
  }, [state]);

  return (
    <div className='flex w-full flex-col items-center'>
      <form className='w-[80%] rounded-md' action={formAction}>
        <div className='flex w-full items-center justify-between'>
          <h1 className='text-xl text-slate-500'>
            Build a user segment with tags
          </h1>
          <div className='flex gap-4'>
            <Button
              href='/dashboard/segments'
              as={Link}
              color='danger'
              variant='solid'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              isDisabled={pending}
              isLoading={pending}
              color='primary'
              variant='solid'
            >
              Save
            </Button>
          </div>
        </div>

        <Divider className='my-10' />

        <div>
          {/* Segment ID */}
          {isUpdate && (
            <Input
              className='hidden'
              id='id'
              name='id'
              value={segmentFields.id}
            />
          )}

          {/* Segment Criteria */}
          <div className='w-8/10'>
            <div className={'mb-2 flex gap-2'}>
              <MagnifyingGlassIcon className='w-5' />
              <p className='text-lg'>Criteria</p>
            </div>
            <QueryBuilder
              tags={tags}
              initialCriteria={JSON.parse(segmentFields.criteria)}
              onChange={(criteria) => {
                setSegmentFields({
                  ...segmentFields,
                  criteria: JSON.stringify(criteria),
                });
              }}
            />
          </div>

          <Divider className='my-6' />

          {/* Segment Name */}
          <div
            className={clsx('mb-2 flex gap-2', {
              'text-danger': state.fieldErrors?.name,
            })}
          >
            <TagIcon className='w-5' />
            <p className='text-lg'>Name</p>
          </div>
          <Input
            className='mb-6 w-1/2'
            id='name'
            name='name'
            variant='bordered'
            fullWidth={false}
            size='lg'
            value={segmentFields.name}
            isInvalid={state.fieldErrors?.name && true}
            errorMessage={state.fieldErrors?.name && state.fieldErrors?.name[0]}
            onValueChange={(v) =>
              setSegmentFields({
                ...segmentFields,
                name: v,
              })
            }
          />

          {/* Segment Description */}
          <div
            className={clsx('mb-2 flex gap-2', {
              'text-danger': state.fieldErrors?.desc,
            })}
          >
            <DocumentTextIcon className='w-5' />
            <p className='text-lg'>Description</p>
          </div>
          <Textarea
            className='w-1/2'
            id='desc'
            name='desc'
            variant='bordered'
            fullWidth={false}
            size='lg'
            value={segmentFields.desc}
            isInvalid={state.fieldErrors?.desc && true}
            errorMessage={state.fieldErrors?.desc && state.fieldErrors?.desc[0]}
            onValueChange={(v) =>
              setSegmentFields({
                ...segmentFields,
                desc: v,
              })
            }
          />
        </div>
      </form>
    </div>
  );
}

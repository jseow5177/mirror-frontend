'use client';

import React, { useState, useEffect } from 'react';
import { Segment, Tag } from '@/app/lib/model';
import { DocumentTextIcon, TagIcon } from '@heroicons/react/24/outline';
import {
  createSegment,
  updateSegment,
  SegmentState,
} from '@/app/lib/segment-action';
import { useActionState } from 'react';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';
import { Link, Button, Input, Textarea } from '@nextui-org/react';
import { CriteriaInput } from './criteria';

export default function SegmentForm({
  segment,
  tags,
}: {
  segment?: Segment;
  tags: Array<Tag>;
}) {
  let isUpdate = false;
  if (segment) {
    isUpdate = true;
  }

  const initialState: SegmentState = {
    message: null,
    fieldErrors: {},
    error: null,
    payload: null,
  };

  const [segmentFields, setSegmentFields] = useState({
    segmentID: `${segment?.segment_id}` || '',
    segmentName: segment?.segment_name || '',
    segmentDesc: segment?.segment_desc || '',
    criteria: segment?.criteria || '{}',
  });

  const handleCreateSegment = (s: SegmentState, formData: FormData) => {
    formData.append('criteria', segmentFields.criteria);
    return createSegment(s, formData);
  };

  const handleUpdateSegment = (s: SegmentState, formData: FormData) => {
    formData.append('criteria', segmentFields.criteria);
    return updateSegment(s, formData);
  };

  const [state, formAction, pending] = useActionState(
    !isUpdate ? handleCreateSegment : handleUpdateSegment,
    initialState
  );

  useEffect(() => {
    if (!state.fieldErrors) {
      if (state.error) {
        toast.error(state.message ? state.message : 'Error encountered');
      } else if (state.message) {
        toast.success(state.message);
        redirect('/dashboard/segments');
      }
    }

    // keep form state
    setSegmentFields({
      segmentID: segmentFields.segmentID,
      segmentName: segmentFields.segmentName,
      segmentDesc: segmentFields.segmentDesc,
      criteria: segmentFields.criteria,
    });
  }, [state]);

  return (
    <form className='w-1/2' action={formAction}>
      <div className='border-gray-60 rounded-md border-2 p-6'>
        {/* Segment ID */}
        {isUpdate && (
          <Input
            className='hidden'
            id='segmentID'
            name='segmentID'
            value={segmentFields.segmentID}
          />
        )}

        {/* Segment Name */}
        <Input
          className='mb-6'
          id='segmentName'
          name='segmentName'
          variant='bordered'
          label={<p className='text-base'>Segment name</p>}
          fullWidth
          size='lg'
          value={segmentFields.segmentName}
          startContent={<TagIcon className='w-5' />}
          labelPlacement='outside'
          placeholder='Enter segment name'
          isInvalid={state.fieldErrors?.segmentName && true}
          errorMessage={
            state.fieldErrors?.segmentName && state.fieldErrors?.segmentName[0]
          }
          onValueChange={(v) =>
            setSegmentFields({
              ...segmentFields,
              segmentName: v,
            })
          }
        />

        {/* Segment Description */}
        <Textarea
          className='mb-6'
          id='segmentDesc'
          name='segmentDesc'
          variant='bordered'
          label={<p className='text-base'>Segment Description</p>}
          fullWidth
          size='lg'
          value={segmentFields.segmentDesc}
          startContent={<DocumentTextIcon className='w-5' />}
          labelPlacement='outside'
          placeholder='Enter segment description'
          isInvalid={state.fieldErrors?.segmentDesc && true}
          errorMessage={
            state.fieldErrors?.segmentDesc && state.fieldErrors?.segmentDesc[0]
          }
          onValueChange={(v) =>
            setSegmentFields({
              ...segmentFields,
              segmentDesc: v,
            })
          }
        />

        {/* Segment Criteria */}
        <div>
          <p className='mb-2 text-base'>Segment Criteria</p>
          <CriteriaInput
            criteria={segmentFields.criteria}
            tags={tags}
            onChange={(c) => {
              setSegmentFields({
                ...segmentFields,
                criteria: c,
              });
            }}
          />
          {state.fieldErrors?.criteria && (
            <p className='text-tiny text-danger'>
              {state.fieldErrors?.criteria[0]}
            </p>
          )}
        </div>
      </div>
      <div className='mt-6 flex justify-end gap-4'>
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
          {`${isUpdate ? 'Update' : 'Create'}`} Segment
        </Button>
      </div>
    </form>
  );
}

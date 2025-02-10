'use client';

import React, { startTransition, useActionState, useState } from 'react';
import { createTag, TagState } from '@/app/_lib/action/tag';
import { Tag, TagValueType, TagValueTypes } from '@/app/_lib/model/tag';
import { DocumentTextIcon, TagIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import {
  Link,
  Button,
  Input,
  Textarea,
  RadioGroup,
  Radio,
} from '@nextui-org/react';

export default function TagForm({ tag }: { tag?: Tag }) {
  let isUpdate = false;
  if (tag) {
    isUpdate = true;
  }

  const initialState: TagState = {
    message: null,
    fieldErrors: {},
    error: null,
    tagID: null,
  };
  const [state, formAction, pending] = useActionState(createTag, initialState);

  const [tagFields, setTagFields] = useState({
    id: tag?.id ? `${tag?.id}` : '0',
    name: tag?.name || '',
    tag_desc: tag?.tag_desc || '',
    value_type: tag?.value_type || '0',
  });

  useEffect(() => {
    if (state.fieldErrors) {
      return;
    }

    if (state.error) {
      toast.error(state.error ? state.error : 'Error encountered');
    } else {
      if (state.message) {
        toast.success(state.message);
      }
      redirect(`/dashboard/tags/${state.tagID}`);
    }
  }, [state]);

  return (
    <form
      className='w-1/2'
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => formAction(new FormData(e.currentTarget)));
      }}
    >
      <div className='border-gray-60 rounded-md border-2 p-6'>
        {/* Tag ID */}
        {isUpdate && (
          <Input className='hidden' id='id' name='id' value={tagFields.id} />
        )}

        {/* Tag Name */}
        <Input
          className='mb-6'
          id='name'
          name='name'
          variant='bordered'
          label={<p className='text-base'>Tag name</p>}
          fullWidth
          size='lg'
          value={tagFields.name}
          startContent={<TagIcon className='w-5' />}
          labelPlacement='outside'
          placeholder='Enter tag name'
          isInvalid={state.fieldErrors?.name && true}
          errorMessage={state.fieldErrors?.name && state.fieldErrors?.name[0]}
          onValueChange={(v) =>
            setTagFields({
              ...tagFields,
              name: v,
            })
          }
        />

        {/* Tag Description */}
        <Textarea
          className='mb-6'
          id='tag_desc'
          name='tag_desc'
          variant='bordered'
          label={<p className='text-base'>Tag Description</p>}
          fullWidth
          size='lg'
          value={tagFields.tag_desc}
          startContent={<DocumentTextIcon className='w-5' />}
          labelPlacement='outside'
          placeholder='Enter tag description'
          isInvalid={state.fieldErrors?.tag_desc && true}
          errorMessage={
            state.fieldErrors?.tag_desc && state.fieldErrors?.tag_desc[0]
          }
          onValueChange={(v) =>
            setTagFields({
              ...tagFields,
              tag_desc: v,
            })
          }
        />

        {/* Tag Value Type */}
        {!isUpdate && (
          <RadioGroup
            id='valueType'
            name='valueType'
            label='Tag Value Type'
            orientation='horizontal'
            value={`${tagFields.value_type}`}
            isInvalid={state.fieldErrors?.valueType && true}
            errorMessage={
              state.fieldErrors?.valueType && state.fieldErrors?.valueType[0]
            }
            onValueChange={(v) =>
              setTagFields({
                ...tagFields,
                value_type: v,
              })
            }
          >
            <Radio value={`${TagValueType.Str}`}>
              {TagValueTypes[TagValueType.Str]}
            </Radio>
            <Radio value={`${TagValueType.Int}`}>
              {TagValueTypes[TagValueType.Int]}
            </Radio>
            <Radio value={`${TagValueType.Float}`}>
              {TagValueTypes[TagValueType.Float]}
            </Radio>
          </RadioGroup>
        )}
      </div>
      <div className='mt-6 flex justify-end gap-4'>
        <Button href='/dashboard/tags' as={Link} color='danger' variant='solid'>
          Cancel
        </Button>
        <Button
          type='submit'
          isDisabled={pending}
          isLoading={pending}
          color='primary'
          variant='solid'
        >
          {`${isUpdate ? 'Update' : 'Create'}`} Tag
        </Button>
      </div>
    </form>
  );
}

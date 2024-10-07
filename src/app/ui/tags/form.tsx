'use client';

import React, { useState } from 'react';
import { createTag, TagState, updateTag } from '@/app/lib/action';
import { Tag, TagValueType, tagValueTypes } from '@/app/lib/model';
import { DocumentTextIcon, TagIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useActionState } from 'react';
import { redirect } from 'next/navigation';
import {
  Tooltip,
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
    payload: null,
  };
  const [state, formAction, pending] = useActionState(
    !isUpdate ? createTag : updateTag,
    initialState
  );

  const [tagFields, setTagFields] = useState({
    tagID: `${tag?.tag_id}` || '',
    tagName: tag?.tag_name || '',
    tagDesc: tag?.tag_desc || '',
    tagValueType: `${tag?.tag_value_type}` || '',
  });

  useEffect(() => {
    if (!state.fieldErrors) {
      if (state.error) {
        toast.error(state.message ? state.message : 'Error encountered');
      } else if (state.message) {
        toast.success(state.message);
        redirect('/dashboard/tags');
      }
    }

    // keep form state
    if (state.payload) {
      setTagFields({
        tagID: (state.payload?.get('tagID') as string) || tagFields.tagID,
        tagName: (state.payload?.get('tagName') as string) || tagFields.tagName,
        tagDesc: (state.payload?.get('tagDesc') as string) || tagFields.tagDesc,
        tagValueType:
          (state.payload?.get('tagValueType') as string) ||
          tagFields.tagValueType,
      });
    }
  }, [state]);

  return (
    <form className='w-1/2' action={formAction}>
      <div className='border-gray-60 rounded-md border-2 p-6'>
        {/* Tag ID */}
        {isUpdate && (
          <Input
            className='hidden'
            id='tagID'
            name='tagID'
            value={tagFields.tagID}
          />
        )}

        {/* Tag Name */}
        <Input
          className='mb-6'
          id='tagName'
          name='tagName'
          variant='bordered'
          label={<p className='text-base'>Tag name</p>}
          fullWidth
          size='lg'
          value={tagFields.tagName}
          startContent={<TagIcon className='w-5' />}
          labelPlacement='outside'
          placeholder='Enter tag name'
          isInvalid={state.fieldErrors?.tagName && true}
          errorMessage={
            state.fieldErrors?.tagName && state.fieldErrors?.tagName[0]
          }
          onValueChange={(v) =>
            setTagFields({
              ...tagFields,
              tagName: v,
            })
          }
        />

        {/* Tag Description */}
        <Textarea
          className='mb-6'
          id='tagDesc'
          name='tagDesc'
          variant='bordered'
          label={<p className='text-base'>Tag Description</p>}
          fullWidth
          size='lg'
          value={tagFields.tagDesc}
          startContent={<DocumentTextIcon className='w-5' />}
          labelPlacement='outside'
          placeholder='Enter tag description'
          isInvalid={state.fieldErrors?.tagDesc && true}
          errorMessage={
            state.fieldErrors?.tagDesc && state.fieldErrors?.tagDesc[0]
          }
          onValueChange={(v) =>
            setTagFields({
              ...tagFields,
              tagDesc: v,
            })
          }
        />

        {/* Tag Value Type */}
        {!isUpdate && (
          <RadioGroup
            id='tagValueType'
            name='tagValueType'
            label='Tag Value Type'
            orientation='horizontal'
            value={tagFields.tagValueType}
            isInvalid={state.fieldErrors?.tagValueType && true}
            errorMessage={
              state.fieldErrors?.tagValueType &&
              state.fieldErrors?.tagValueType[0]
            }
            onValueChange={(v) =>
              setTagFields({
                ...tagFields,
                tagValueType: v,
              })
            }
          >
            <Radio value={`${TagValueType.Str}`}>
              {tagValueTypes[TagValueType.Str]}
            </Radio>
            <Radio value={`${TagValueType.Int}`}>
              {tagValueTypes[TagValueType.Int]}
            </Radio>
            <Radio value={`${TagValueType.Float}`}>
              {tagValueTypes[TagValueType.Float]}
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

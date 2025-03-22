'use client';

import React, {
  startTransition,
  useActionState,
  useRef,
  useState,
} from 'react';
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
} from '@heroui/react';
import Title from '../title';

export default function TagForm({ tag }: { tag?: Tag }) {
  let isUpdate = false;
  if (tag) {
    isUpdate = true;
  }

  const ref = useRef<HTMLFormElement>(null);

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
    <form ref={ref} className='w-1/2'>
      <Title title='Basic Info' />

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
        label={
          <div className='flex gap-2'>
            <TagIcon className='w-5' />
            <p>Name</p>
          </div>
        }
        labelPlacement='inside'
        fullWidth
        value={tagFields.name}
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
        label={
          <div className='flex gap-2'>
            <DocumentTextIcon className='w-5' />
            <p>Description</p>
          </div>
        }
        labelPlacement='inside'
        fullWidth
        value={tagFields.tag_desc}
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
      <div className='mt-6 flex justify-end gap-4'>
        <Button href='/dashboard/tags' as={Link} color='danger' variant='solid'>
          Cancel
        </Button>
        <Button
          onPress={() => {
            if (ref.current) {
              startTransition(() => formAction(new FormData(ref.current!)));
            }
          }}
          isDisabled={pending}
          isLoading={pending}
          color='primary'
          variant='solid'
        >
          Save
        </Button>
      </div>
    </form>
  );
}

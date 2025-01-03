'use client';

import React, { useState, useEffect } from 'react';
import { Segment } from '@/app/lib/model/segment';
import { Tag } from '@/app/lib/model/tag';
import {
  DocumentTextIcon,
  TagIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { createSegment, SegmentState } from '@/app/lib/segment-action';
import { useActionState } from 'react';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Link,
  Button,
  Input,
  Textarea,
  Divider,
  Skeleton,
  Tooltip,
} from '@nextui-org/react';
import { emptyCriteria, QueryBuilder } from './query-builder';
import clsx from 'clsx';
import { previewUd } from '@/app/lib/segment-data';
import { validateCriteria } from '@/app/lib/utils';
import { Criteria } from '@/app/lib/model/segment';
import NumberCircles from '../number-circle';
import Title from '../title';

const TOTAL_STEPS = 2;

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

  const [currentStep, setCurrentStep] = useState(1);

  const initialState: SegmentState = {
    message: null,
    fieldErrors: {},
    error: null,
  };

  const [segmentFields, setSegmentFields] = useState({
    id: segment?.id ? `${segment?.id}` : '0',
    name: segment?.name || '',
    desc: segment?.desc || '',
    criteria: segment?.criteria || emptyCriteria,
  });

  const handleCreateSegment = (s: SegmentState, formData: FormData) => {
    formData.append('criteria', JSON.stringify(segmentFields.criteria));
    return createSegment(s, formData);
  };

  const [state, formAction, pending] = useActionState(
    handleCreateSegment,
    initialState
  );

  const [segmentSize, setSegmentSize] = useState(-1);
  const [isPreviewLoading, setPreviewLoading] = useState(false);

  const useDebouncedPreview = (criteria: Criteria, delay = 500) => {
    useEffect(() => {
      if (!criteria) return;

      const controller = new AbortController();
      const { signal } = controller;

      const debounce = setTimeout(async () => {
        if (!validateCriteria(criteria)) {
          return;
        }

        try {
          setPreviewLoading(true);
          const [count, _] = await Promise.all([
            previewUd(criteria, signal),
            new Promise((r) => setTimeout(r, 300)),
          ]);
          setSegmentSize(count);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : String(error));
        } finally {
          setPreviewLoading(false);
        }
      }, delay);

      return () => {
        clearTimeout(debounce);
        controller.abort();
        setPreviewLoading(false);
      };
    }, [criteria, delay]);
  };

  useDebouncedPreview(segmentFields.criteria, 1000);

  useEffect(() => {
    if (!state.fieldErrors) {
      if (state.error) {
        toast.error(state.error ? state.error : 'Error encountered');
      } else if (state.message) {
        toast.success(state.message);
        redirect('/dashboard/segments');
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

  const atLastStep = currentStep === TOTAL_STEPS;

  const nextStep = () => {
    if (!validateCriteria(segmentFields.criteria)) {
      toast.error('Criteria is incomplete!');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep === 1) {
      return;
    }
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className='flex w-full flex-col items-center'>
      <form className='w-[90%] rounded-md' action={formAction}>
        <div className='flex w-full items-center justify-between'>
          <NumberCircles
            totalSteps={TOTAL_STEPS}
            currentStep={currentStep}
            onPress={(s) => {
              if (
                currentStep === 1 &&
                !validateCriteria(segmentFields.criteria)
              ) {
                toast.error('Criteria is incomplete!');
              } else {
                setCurrentStep(s);
              }
            }}
          />
          <div className='flex items-center justify-end'>
            <div className='flex gap-4'>
              <Skeleton isLoaded={!isPreviewLoading} className='rounded-lg'>
                <h1 className='text-right text-3xl text-slate-700'>
                  {segmentSize === -1 ? 'No Data' : segmentSize}
                </h1>
              </Skeleton>
              <Tooltip
                showArrow
                color='foreground'
                content='Define criteria to preview size.'
              >
                <InformationCircleIcon className='w-4' />
              </Tooltip>
            </div>

            <Divider orientation='vertical' className='ml-10 mr-5 h-10' />

            <div className='flex items-center gap-4'>
              <Button
                href='/dashboard/segments'
                as={Link}
                isDisabled={pending}
                color='danger'
                variant='light'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                isDisabled={pending || currentStep == 1}
                color='default'
                variant='solid'
                onPress={() => {
                  previousStep();
                }}
              >
                Previous
              </Button>
              {atLastStep ? (
                <Button
                  type='submit'
                  isDisabled={pending}
                  isLoading={pending}
                  color='success'
                  variant='solid'
                >
                  Save
                </Button>
              ) : (
                <Button
                  type='button'
                  isDisabled={pending}
                  color='primary'
                  variant='solid'
                  onClick={(e) => {
                    e.preventDefault();
                    nextStep();
                  }}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>

        <Divider className='my-10' />

        {currentStep === 1 ? (
          <>
            <Title title='Segment Criteria' />
            <QueryBuilder
              tags={tags}
              initialCriteria={segmentFields.criteria}
              onChange={(criteria) => {
                setSegmentFields({
                  ...segmentFields,
                  criteria: criteria,
                });
              }}
            />
          </>
        ) : (
          <>
            <Title title='Basic Info' />

            {/* Segment ID */}
            {isUpdate && (
              <Input
                className='hidden'
                id='id'
                name='id'
                value={segmentFields.id}
              />
            )}

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
              errorMessage={
                state.fieldErrors?.name && state.fieldErrors?.name[0]
              }
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
              errorMessage={
                state.fieldErrors?.desc && state.fieldErrors?.desc[0]
              }
              onValueChange={(v) =>
                setSegmentFields({
                  ...segmentFields,
                  desc: v,
                })
              }
            />
          </>
        )}
      </form>
    </div>
  );
}

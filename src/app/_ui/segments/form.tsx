'use client';

import React, {
  useState,
  useEffect,
  useActionState,
  startTransition,
  useRef,
} from 'react';
import { Segment } from '@/app/_lib/model/segment';
import { Tag } from '@/app/_lib/model/tag';
import {
  DocumentTextIcon,
  TagIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { createSegment, SegmentState } from '@/app/_lib/action/segment';
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
} from '@heroui/react';
import { emptyCriteria, QueryBuilder } from './query-builder';
import { previewUd } from '@/app/_lib/data/segment';
import { validateCriteria } from '@/app/_lib/utils';
import { Criteria } from '@/app/_lib/model/segment';
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

  const ref = useRef<HTMLFormElement>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const initialState: SegmentState = {
    message: null,
    fieldErrors: {},
    error: null,
    segmentID: null,
  };

  const [segmentFields, setSegmentFields] = useState({
    id: segment?.id ? `${segment?.id}` : '0',
    name: segment?.name || '',
    segment_desc: segment?.segment_desc || '',
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

      const debounce = setTimeout(async () => {
        if (!validateCriteria(criteria)) {
          setSegmentSize(-1);
          return;
        }

        try {
          setPreviewLoading(true);
          const [count] = await Promise.all([
            previewUd(criteria),
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
        setPreviewLoading(false);
      };
    }, [criteria, delay]);
  };

  useDebouncedPreview(segmentFields.criteria, 1000);

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
      redirect(`/dashboard/segments/${state.segmentID}`);
    }
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
      <form ref={ref} className='w-full'>
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
          <div className='flex items-center gap-4'>
            <div className='flex gap-2'>
              <Skeleton isLoaded={!isPreviewLoading} className='rounded-lg'>
                <h2 className='text-right text-3xl text-slate-700'>
                  {segmentSize === -1 ? 'No Data' : segmentSize}
                </h2>
              </Skeleton>
              <Tooltip
                showArrow
                color='foreground'
                content='Define criteria to preview size.'
              >
                <InformationCircleIcon className='w-4' />
              </Tooltip>
            </div>

            <Divider orientation='vertical' className='mx-2 h-10' />

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
              isDisabled={pending || currentStep == 1}
              color='default'
              variant='solid'
              onPress={previousStep}
            >
              Previous
            </Button>
            {atLastStep ? (
              <Button
                onPress={() => {
                  startTransition(() => {
                    if (ref.current) {
                      formAction(new FormData(ref.current));
                    }
                  });
                }}
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
                isDisabled={pending || isPreviewLoading}
                color='primary'
                variant='solid'
                onPress={nextStep}
              >
                Next
              </Button>
            )}
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
          <div className='w-[50%]'>
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
              fullWidth={false}
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
            <Textarea
              id='segment_desc'
              name='segment_desc'
              variant='bordered'
              label={
                <div className='flex gap-2'>
                  <DocumentTextIcon className='w-5' />
                  <p>Description</p>
                </div>
              }
              labelPlacement='inside'
              fullWidth={false}
              value={segmentFields.segment_desc}
              isInvalid={state.fieldErrors?.segment_desc && true}
              errorMessage={
                state.fieldErrors?.segment_desc &&
                state.fieldErrors?.segment_desc[0]
              }
              onValueChange={(v) =>
                setSegmentFields({
                  ...segmentFields,
                  segment_desc: v,
                })
              }
            />
          </div>
        )}
      </form>
    </div>
  );
}

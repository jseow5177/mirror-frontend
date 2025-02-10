'use client';

import React, {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import EmailEditor, { EditorRef } from 'react-email-editor';
import { Button, Link, Divider, Input, Textarea } from '@nextui-org/react';
import { Email } from '@/app/_lib/model/email';
import { createEmail, EmailState } from '@/app/_lib/action/email';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import clsx from 'clsx';
import { TagIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import NumberCircles from '../number-circle';
import Title from '../title';

const TOTAL_STEPS = 2;

export default function EmailForm({ email }: { email?: Email }) {
  const ref = useRef<EditorRef>(null);

  const [currentStep, setCurrentStep] = useState(1);

  let isUpdate = false;
  if (email) {
    isUpdate = true;
  }

  const initialState: EmailState = {
    message: null,
    fieldErrors: {},
    error: null,
    emailID: null,
  };

  const [emailFields, setEmailFields] = useState({
    id: email?.id ? `${email?.id}` : '0',
    name: email?.name || '',
    email_desc: email?.email_desc || '',
    json: email?.json || '{}',
    html: email?.html || '',
  });

  const handleCreateEmail = (s: EmailState, formData: FormData) => {
    formData.append('json', emailFields.json);
    formData.append('html', emailFields.html);
    return createEmail(s, formData);
  };

  const [state, formAction, pending] = useActionState(
    handleCreateEmail,
    initialState
  );

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
      redirect(`/dashboard/emails/${state.emailID}`);
    }
  }, [state]);

  const atLastStep = currentStep === TOTAL_STEPS;

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    if (currentStep === 1) {
      return;
    }
    setCurrentStep(currentStep - 1);
  };

  const extractEmailJson = () => {
    const unlayer = ref.current?.editor;

    if (!unlayer) return;

    unlayer.saveDesign((js: any) => {
      const json = JSON.stringify(js);

      unlayer.exportHtml((data) => {
        const { html } = data;
        const encodedHtml = btoa(html);

        setEmailFields((prevFields) => ({
          ...prevFields,
          json,
          html: encodedHtml,
        }));

        nextStep();
      });
    });
  };

  const loadEmailJson = () => {
    const unlayer = ref.current?.editor;

    if (emailFields.json !== '{}') {
      unlayer?.loadDesign(JSON.parse(emailFields.json));
    }
  };

  return (
    <div className='flex w-full flex-col items-center'>
      <form
        className='w-[90%] rounded-md'
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(() => formAction(new FormData(e.currentTarget)));
        }}
      >
        <div className='flex w-full items-center justify-between'>
          <NumberCircles
            totalSteps={TOTAL_STEPS}
            currentStep={currentStep}
            onPress={(s) => setCurrentStep(s)}
          />
          <div className='flex items-center gap-4'>
            <Button
              href='/dashboard/emails'
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
                  extractEmailJson();
                }}
              >
                Next
              </Button>
            )}
          </div>
        </div>

        <Divider className='my-10' />

        {currentStep === 1 ? (
          <>
            <Title title='Email Template' />

            <EmailEditor
              ref={ref}
              onReady={() => {
                loadEmailJson();
              }}
            />
          </>
        ) : (
          <>
            <Title title='Basic Info' />

            {/* Email ID */}
            {isUpdate && (
              <Input
                className='hidden'
                id='id'
                name='id'
                value={emailFields.id}
              />
            )}

            {/* Email Name */}
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
              value={emailFields.name}
              isInvalid={state.fieldErrors?.name && true}
              errorMessage={
                state.fieldErrors?.name && state.fieldErrors?.name[0]
              }
              onValueChange={(v) =>
                setEmailFields({
                  ...emailFields,
                  name: v,
                })
              }
            />

            {/* Email Description */}
            <div
              className={clsx('mb-2 flex gap-2', {
                'text-danger': state.fieldErrors?.email_desc,
              })}
            >
              <DocumentTextIcon className='w-5' />
              <p className='text-lg'>Description</p>
            </div>
            <Textarea
              className='w-1/2'
              id='email_desc'
              name='email_desc'
              variant='bordered'
              fullWidth={false}
              size='lg'
              value={emailFields.email_desc}
              isInvalid={state.fieldErrors?.email_desc && true}
              errorMessage={
                state.fieldErrors?.email_desc &&
                state.fieldErrors?.email_desc[0]
              }
              onValueChange={(v) =>
                setEmailFields({
                  ...emailFields,
                  email_desc: v,
                })
              }
            />
          </>
        )}
      </form>
    </div>
  );
}

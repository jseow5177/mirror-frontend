'use client';

import React, {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import EmailEditor, { EditorRef } from 'react-email-editor';
import { Button, Link, Divider, Input, Textarea } from '@heroui/react';
import { Email } from '@/app/_lib/model/email';
import { createEmail, EmailState, updateEmail } from '@/app/_lib/action/email';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import { TagIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import NumberCircles from '../number-circle';
import Title from '../title';

const TOTAL_STEPS = 2;

export default function EmailForm({ email }: { email?: Email }) {
  const editorRef = useRef<EditorRef>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [currentStep, setCurrentStep] = useState(1);

  const [isJsonLoaded, setIsJsonLoaded] = useState(false);

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
    id: email?.id ? email?.id : 0,
    name: email?.name || '',
    email_desc: email?.email_desc || '',
    json: email?.json || '{}',
    html: email?.html || '',
  });

  const handleCreateEmail = (s: EmailState, formData: FormData) => {
    formData.append('json', emailFields.json);
    formData.append('html', emailFields.html);

    if (emailFields.id > 0) {
      return updateEmail(s, formData);
    } else {
      return createEmail(s, formData);
    }
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

  useEffect(() => {
    if (currentStep === 1) {
      setIsJsonLoaded(false);
    }
  }, [currentStep]);

  const extractEmailJson = () => {
    const unlayer = editorRef.current?.editor;

    if (!unlayer) return;

    unlayer.saveDesign((js: any) => {
      const json = JSON.stringify(js);

      unlayer.exportHtml((data) => {
        const { html } = data;
        try {
          const encodedHtml = btoa(
            encodeURIComponent(
              html.replace('style="min-height: 100vh;"', '') // remove vh style due to display mode web
            )
          );
          setEmailFields((prevFields) => ({
            ...prevFields,
            json,
            html: encodedHtml,
          }));

          nextStep();
        } catch (error) {
          console.log(`encode email err: ${error}`);
          toast.error('Fail to encode email html');
        }
      });
    });
  };

  const loadEmailJson = () => {
    const unlayer = editorRef.current?.editor;

    if (emailFields.json !== '{}') {
      unlayer?.loadDesign(JSON.parse(emailFields.json));
    }

    setIsJsonLoaded(true);
  };

  return (
    <div className='flex w-full flex-col items-center'>
      <form ref={formRef} className='w-full'>
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
                onPress={() => {
                  startTransition(() => {
                    if (formRef.current) {
                      formAction(new FormData(formRef.current));
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
                color='primary'
                variant='solid'
                onPress={extractEmailJson}
                isDisabled={!isJsonLoaded}
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
              editorId='editor'
              ref={editorRef}
              options={{
                displayMode: 'web',
              }}
              onReady={loadEmailJson}
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
                value={`${emailFields.id}`}
              />
            )}

            {/* Email Name */}
            <Input
              className='mb-6 w-1/2'
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
            <Textarea
              className='w-1/2'
              id='email_desc'
              name='email_desc'
              variant='bordered'
              label={
                <div className='flex gap-2'>
                  <DocumentTextIcon className='w-5' />
                  <p>Description</p>
                </div>
              }
              labelPlacement='inside'
              fullWidth={false}
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

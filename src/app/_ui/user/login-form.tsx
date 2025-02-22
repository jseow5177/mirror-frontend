'use client';

import { logIn, LogInState } from '@/app/_lib/action/user';
import {
  BuildingOfficeIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Button, Input } from '@heroui/react';
import { redirect } from 'next/navigation';
import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';

export default function LogInForm() {
  const initialState: LogInState = {
    message: null,
    fieldErrors: {},
    error: null,
  };
  const [state, formAction, pending] = useActionState(logIn, initialState);

  const [logInFields, setLogInFields] = useState({
    tenant_name: '',
    username: '',
    password: '',
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
      redirect('/dashboard');
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
        {/* Tenant Name */}
        <Input
          className='mb-6'
          id='tenant_name'
          name='tenant_name'
          variant='bordered'
          label={
            <div className='flex gap-2'>
              <BuildingOfficeIcon className='w-5' />
              <p className='text-lg'>Tenant Name</p>
            </div>
          }
          labelPlacement='inside'
          fullWidth
          size='lg'
          value={logInFields.tenant_name}
          isInvalid={state.fieldErrors?.tenant_name && true}
          errorMessage={
            state.fieldErrors?.tenant_name && state.fieldErrors?.tenant_name[0]
          }
          onValueChange={(v) =>
            setLogInFields({
              ...logInFields,
              tenant_name: v,
            })
          }
        />

        {/* User name */}
        <Input
          className='mb-6'
          id='username'
          name='username'
          variant='bordered'
          label={
            <div className='flex gap-2'>
              <UserIcon className='w-5' />
              <p className='text-lg'>Username</p>
            </div>
          }
          labelPlacement='inside'
          fullWidth
          size='lg'
          value={logInFields.username}
          isInvalid={state.fieldErrors?.username && true}
          errorMessage={
            state.fieldErrors?.username && state.fieldErrors?.username[0]
          }
          onValueChange={(v) =>
            setLogInFields({
              ...logInFields,
              username: v,
            })
          }
        />

        {/* Password */}
        <Input
          className='mb-6'
          id='password'
          name='password'
          variant='bordered'
          type='password'
          label={
            <div className='flex gap-2'>
              <ShieldCheckIcon className='w-5' />
              <p className='text-lg'>Password</p>
            </div>
          }
          labelPlacement='inside'
          fullWidth
          size='lg'
          value={logInFields.password}
          isInvalid={state.fieldErrors?.password && true}
          errorMessage={
            state.fieldErrors?.password && state.fieldErrors?.password[0]
          }
          onValueChange={(v) =>
            setLogInFields({
              ...logInFields,
              password: v,
            })
          }
          autoComplete='on'
        />

        <div className='flex justify-end'>
          <Button
            type='submit'
            isDisabled={pending}
            isLoading={pending}
            color='primary'
            variant='solid'
            size='lg'
            className='min-w-[20%]'
          >
            Log In
          </Button>
        </div>
      </div>
    </form>
  );
}

'use client';

import { initUser, InitUserState } from '@/app/_lib/action/user';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '@heroui/react';
import { redirect } from 'next/navigation';
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';

export default function InitUserForm({ token }: { token: string }) {
  const initialState: InitUserState = {
    message: null,
    fieldErrors: {},
    error: null,
  };

  const ref = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(initUser, initialState);

  const [initUserFields, setInitUserFields] = useState({
    token: token,
    password: '',
  });

  useEffect(() => {
    if (state.fieldErrors) {
      if (state.fieldErrors.token) {
        toast.error('Missing token');
      }
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
    <form className='w-1/2' ref={ref}>
      {/* Token */}
      <Input
        className='hidden'
        id='token'
        name='token'
        value={initUserFields.token}
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
            <p>Password</p>
          </div>
        }
        labelPlacement='inside'
        fullWidth
        value={initUserFields.password}
        isInvalid={state.fieldErrors?.password && true}
        errorMessage={
          state.fieldErrors?.password && state.fieldErrors?.password[0]
        }
        onValueChange={(v) =>
          setInitUserFields({
            ...initUserFields,
            password: v,
          })
        }
        autoComplete='on'
      />

      <div className='flex justify-end'>
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
          color='primary'
          variant='solid'
          size='lg'
          className='min-w-[20%]'
        >
          Submit
        </Button>
      </div>
    </form>
  );
}

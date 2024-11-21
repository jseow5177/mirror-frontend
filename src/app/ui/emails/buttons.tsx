import { Button, ButtonGroup, Link } from '@nextui-org/react';
import { EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Email } from '@/app/lib/model/email';

export function CreateEmail() {
  return (
    <Button
      href='/dashboard/emails/create'
      as={Link}
      color='primary'
      variant='solid'
      startContent={<PlusIcon className='h-8' />}
    >
      Create Email
    </Button>
  );
}

export function ViewEmail({ id }: { id: number }) {
  return (
    <Button
      isIconOnly
      variant='bordered'
      as={Link}
      href={`/dashboard/emails/${id}`}
      isDisabled
    >
      <EyeIcon className='h-5' />
    </Button>
  );
}

export function EmailActions({ email }: { email: Email }) {
  return (
    <ButtonGroup>
      <ViewEmail id={email.id || 0} />
    </ButtonGroup>
  );
}

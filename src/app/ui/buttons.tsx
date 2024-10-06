//'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { Spinner } from '@nextui-org/react';

export enum ButtonColors {
  Primary = 'bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 focus-visible:outline-blue-600 text-white',
  Neutral = 'bg-gray-400 hover:bg-gray-300 disabled:bg-gray-400 focus-visible:outline-gray-600 text-gray-600',
  Warn = 'bg-red-600 hover:bg-red-500 disabled:bg-red-400 focus-visible:outline-red-600 text-white',
}

export function LinkButton({
  label,
  href,
  Icon,
  openInNewTab = false,
  color = ButtonColors.Primary,
}: {
  label: string;
  href: string;
  Icon?: React.ElementType;
  openInNewTab?: boolean;
  color?: ButtonColors;
}) {
  return (
    <Link
      href={href}
      target={openInNewTab ? '_blank' : ''}
      rel='noopener noreferrer'
      className={`flex h-10 items-center rounded-lg ${color} px-4 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
    >
      <span className='block'>{label}</span>
      {Icon && <Icon className='ml-2 h-5' />}
    </Link>
  );
}

export function LinkIconButton({
  href,
  Icon,
  openInNewTab = false,
}: {
  href: string;
  Icon: React.ElementType;
  openInNewTab?: boolean;
}) {
  return (
    <Link
      href={href}
      target={openInNewTab ? '_blank' : ''}
      rel='noopener noreferrer'
      className='rounded-md border p-2 hover:bg-gray-100'
    >
      <Icon className='w-5' />
    </Link>
  );
}

export function ActionButton({
  action,
  label,
  Icon,
  color = ButtonColors.Primary,
}: {
  action: () => void;
  label: string;
  Icon?: React.ElementType;
  color?: ButtonColors;
}) {
  return (
    <form action={action}>
      <BaseButton className={`${color}`}>
        <span className='block'>{label}</span>
        {Icon && <Icon className='ml-2 h-5' />}
      </BaseButton>
    </form>
  );
}

export function ActionIconButton({
  action,
  Icon,
  srText,
}: {
  action: () => void;
  Icon: React.ElementType;
  srText: string;
}) {
  return (
    <form action={action}>
      <BaseIconButton>
        <span className='sr-only'>{srText}</span>
        <Icon className='w-5' />
      </BaseIconButton>
    </form>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isPending?: boolean;
}

export function BaseButton({
  children,
  className,
  isPending,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        `flex h-10 min-w-20 items-center justify-center rounded-lg ${ButtonColors.Primary} px-4 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50`,
        className
      )}
    >
      {isPending ? <Spinner size='sm' color='default' /> : children}
    </button>
  );
}

export function BaseIconButton({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx('rounded-md border p-2 hover:bg-gray-100', className)}
    >
      {children}
    </button>
  );
}

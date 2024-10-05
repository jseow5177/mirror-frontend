import Link from 'next/link';

export enum ButtonColors {
  Primary = 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600',
  Neutral = 'bg-gray-600 hover:bg-gray-500 focus-visible:outline-gray-600',
  Warn = 'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600',
}

export function LinkButton({
  label,
  href,
  Icon,
  openInNewTab = false,
}: {
  label: string;
  href: string;
  Icon?: React.ElementType;
  openInNewTab?: boolean;
}) {
  return (
    <Link
      href={href}
      target={openInNewTab ? '_blank' : ''}
      rel='noopener noreferrer'
      className='flex h-10 items-center rounded-lg bg-blue-600 px-4 text-base font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
    >
      <span className='block'>{label}</span>
      {Icon && <Icon className='ml-2 h-5' />}
    </Link>
  );
}

export function LinkIconButton({
  href,
  Icon,
}: {
  href: string;
  Icon: React.ElementType;
}) {
  return (
    <Link href={href} className='rounded-md border p-2 hover:bg-gray-100'>
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
      <button
        className={`flex h-10 items-center rounded-lg ${color} px-4 text-base font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
      >
        <span className='block'>{label}</span>
        {Icon && <Icon className='ml-2 h-5' />}
      </button>
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
      <button className='rounded-md border p-2 hover:bg-gray-100'>
        <span className='sr-only'>{srText}</span>
        <Icon className='w-5' />
      </button>
    </form>
  );
}

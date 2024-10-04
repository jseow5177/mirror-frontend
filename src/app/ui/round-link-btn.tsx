import Link from 'next/link';

export default function RoundLinkButton({
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
      className='flex h-12 items-center rounded-full bg-blue-600 px-5 text-base font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
    >
      {Icon && <Icon className='mr-2 h-5' />}
      <span className='block'>{label}</span>
    </Link>
  );
}

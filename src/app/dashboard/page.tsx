import RoundLinkButton from '@/app/ui/round-link-btn';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default async function Page() {
  return (
    <div className='flex min-h-full flex-col items-center justify-center gap-4'>
      <h1 className='text-2xl'>Welcome to Mirror!</h1>
      <p>Encounter issues? Submit a feedback!</p>
      <RoundLinkButton
        label='Contact Us'
        href='https://www.mirrorcdp.com/#contact'
        openInNewTab
        Icon={ChatBubbleLeftIcon}
      />
    </div>
  );
}

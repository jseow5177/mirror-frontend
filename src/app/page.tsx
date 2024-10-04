import { GlobeAltIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import RoundLinkButton from '@/app/ui/round-link-btn';

export default function Home() {
  return (
    <div className='grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-20 pb-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='row-start-2 flex flex-col items-center gap-8'>
        <div className='flex flex-col items-center gap-8'>
          <h1 className='text-4xl'>Welcome to Mirror</h1>
          <RoundLinkButton
            label='Try it out'
            href='/dashboard'
            Icon={ArrowRightIcon}
          />
        </div>
      </main>
      <footer className='row-start-3 flex flex-wrap items-center justify-center gap-6'>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://www.mirrorcdp.com/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <GlobeAltIcon className='h-5 w-5' />
          <span className='block'>Learn about us!</span>
        </a>
      </footer>
    </div>
  );
}

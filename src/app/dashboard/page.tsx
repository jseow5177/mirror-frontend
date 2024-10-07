import { Suspense } from 'react';
import {
  NumberOfTagsCard,
  NumberOfSegmentsCard,
  DashboardCardSkeleton,
} from '../ui/dashboard/cards';

export default async function Page() {
  return (
    <main>
      <h1 className='mb-8 text-2xl'>Dashboard</h1>
      <div className='grid h-[150px] grid-cols-4 gap-6'>
        <Suspense fallback={<DashboardCardSkeleton />}>
          <NumberOfTagsCard />
        </Suspense>
        <Suspense fallback={<DashboardCardSkeleton />}>
          <NumberOfSegmentsCard />
        </Suspense>
      </div>
    </main>
  );
}

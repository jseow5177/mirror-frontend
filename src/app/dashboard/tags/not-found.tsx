import BaseNotFound from '@/app/_ui/not-found';

export default function NotFound() {
  return (
    <BaseNotFound
      title='Could not find the requested tag.'
      backLink='/dashboard/tags'
    />
  );
}

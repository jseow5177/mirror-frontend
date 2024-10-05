import Breadcrumbs from '@/app/ui/breadcrumbs';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tags', href: '/dashboard/tags' },
          {
            label: 'Create Tag',
            href: '/dashboard/tags/create',
            active: true,
          },
        ]}
      />
    </main>
  );
}

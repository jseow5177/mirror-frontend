import Breadcrumbs from '@/app/ui/breadcrumbs';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Campaigns', href: '/dashboard/campaigns' },
          {
            label: 'Create Campaign',
            href: '/dashboard/campaigns/create',
            isCurrent: true,
          },
        ]}
      />
    </main>
  );
}

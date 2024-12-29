import BaseBreadcrumbs from '@/app/ui/breadcrumbs';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  return (
    <main>
      <BaseBreadcrumbs
        breadcrumbs={[
          { label: 'Emails', href: '/dashboard/emails' },
          {
            label: 'View Email',
            href: `/dashboard/emails/${id}`,
          },
        ]}
      />
    </main>
  );
}

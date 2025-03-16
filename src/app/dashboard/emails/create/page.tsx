import Breadcrumbs from '@/app/_ui/breadcrumbs';
import EmailForm from '@/app/_ui/emails/form';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Emails', href: '/dashboard/emails' },
          {
            label: 'Create Email',
            href: '/dashboard/emails/create',
            isCurrent: true,
          },
        ]}
      />
      <EmailForm />
    </main>
  );
}

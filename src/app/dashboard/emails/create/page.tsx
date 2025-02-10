import Breadcrumbs from '@/app/_ui/breadcrumbs';
import EmailForm from '@/app/_ui/emails/form';

// const EmailForm = dynamic(() => import('@/app/_ui/emails/form'), {
//   ssr: false,
// });

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

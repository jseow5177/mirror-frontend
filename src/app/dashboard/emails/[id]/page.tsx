import { getEmail } from '@/app/_lib/data/email';
import BaseBreadcrumbs from '@/app/_ui/breadcrumbs';
import EmailView from '@/app/_ui/emails/view';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const id = p.id;

  const fetchEmail = async () => {
    const emailID = Number(id) | 0;

    const [email] = await Promise.all([getEmail(emailID)]);

    return {
      email,
    };
  };

  const { email } = await fetchEmail();

  if (!email) {
    notFound();
  }

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
      <EmailView email={email} />
    </main>
  );
}

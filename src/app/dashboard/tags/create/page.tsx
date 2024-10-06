import Breadcrumbs from '@/app/ui/breadcrumbs';
import TagForm from '@/app/ui/tags/form';

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
      <TagForm />
    </main>
  );
}

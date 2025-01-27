import Breadcrumbs from '@/app/_ui/breadcrumbs';
import TagForm from '@/app/_ui/tags/form';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tags', href: '/dashboard/tags' },
          {
            label: 'Create Tag',
            href: '/dashboard/tags/create',
            isCurrent: true,
          },
        ]}
      />
      <TagForm />
    </main>
  );
}

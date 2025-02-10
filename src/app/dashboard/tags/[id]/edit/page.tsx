import React from 'react';
import Breadcrumbs from '@/app/_ui/breadcrumbs';
import TagForm from '@/app/_ui/tags/form';
import { notFound } from 'next/navigation';
import { getTag } from '@/app/_lib/data/tag';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const id = p.id;

  const tag = await getTag(Number(id));

  if (!tag) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tags', href: '/dashboard/tags' },
          {
            label: tag.name,
            href: `/dashboard/tags/${id}`,
          },
          {
            label: 'Edit',
            href: `/dashboard/tags/${id}/edit`,
            isCurrent: true,
          },
        ]}
      />
      <TagForm tag={tag} />
    </main>
  );
}

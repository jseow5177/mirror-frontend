import { getTag } from '@/app/_lib/data/tag';
import Breadcrumbs from '@/app/_ui/breadcrumbs';
import DragAndDrop from '@/app/_ui/tags/file-drop';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
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
            label: 'Upload',
            href: `/dashboard/tags/${id}/upload`,
            isCurrent: true,
          },
        ]}
      />
      <DragAndDrop tag={tag} />
    </main>
  );
}

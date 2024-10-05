'use client';

import React from 'react';
import { useState } from 'react';
import { deleteTag } from '@/app/lib/action';
import {
  ActionIconButton,
  LinkButton,
  LinkIconButton,
  ActionButton,
  ButtonColors,
} from '../buttons';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../modal';
import { toast } from 'react-hot-toast';
import { revalidatePath } from 'next/cache';

export function DeleteTag({ id, name }: { id: number; name: string }) {
  const [showModal, setShowModal] = useState(false);
  const deleteTagWithID = async () => {
    const res = await deleteTag(id);
    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
    }
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <Modal
          title={`Delete tag "${name}"`}
          subTitle='This action is irreversible!'
          Buttons={[
            <ActionButton
              key={1}
              action={() => setShowModal(false)}
              label='Cancel'
              color={ButtonColors.Neutral}
            />,
            <ActionButton
              key={2}
              action={deleteTagWithID}
              label='Confirm'
              color={ButtonColors.Warn}
            />,
          ]}
        />
      )}
      <ActionIconButton
        action={() => setShowModal(true)}
        Icon={TrashIcon}
        srText='Delete'
      />
    </>
  );
}

export function CreateTag() {
  return (
    <LinkButton
      href='/dashboard/tags/create'
      label='Create Tag'
      Icon={PlusIcon}
    />
  );
}

export function UpdateTag({ id }: { id: number }) {
  return (
    <LinkIconButton Icon={PencilIcon} href={`/dashboard/tags/${id}/edit`} />
  );
}

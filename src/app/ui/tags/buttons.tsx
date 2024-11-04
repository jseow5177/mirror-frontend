'use client';

import React from 'react';
import { deleteTag } from '@/app/lib/tag-action';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ButtonGroup,
} from '@nextui-org/react';
import { Button, Link } from '@nextui-org/react';
import { Tag } from '@/app/lib/model/tag';

export function DeleteTag({ id, name }: { id: number; name: string }) {
  const deleteTagWithID = async () => {
    const res = await deleteTag(id);
    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                {`Delete tag "${name}"`}
              </ModalHeader>
              <ModalBody>
                <p>This action is irreversible!</p>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose} color='default' variant='solid'>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await deleteTagWithID();
                    onClose();
                  }}
                  color='danger'
                  variant='solid'
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Button isIconOnly variant='bordered' onClick={onOpen}>
        <TrashIcon className='h-5' />
      </Button>
    </>
  );
}

export function CreateTag() {
  return (
    <Button
      href='/dashboard/tags/create'
      as={Link}
      color='primary'
      variant='solid'
      startContent={<PlusIcon className='h-8' />}
    >
      Create Tag
    </Button>
  );
}

export function UpdateTag({ id }: { id: number }) {
  return (
    <Button
      isIconOnly
      variant='bordered'
      as={Link}
      href={`/dashboard/tags/${id}/edit`}
    >
      <PencilIcon className='h-5' />
    </Button>
  );
}

export function ViewTag({ id }: { id: number }) {
  return (
    <Button
      isIconOnly
      variant='bordered'
      as={Link}
      href={`/dashboard/tags/${id}`}
    >
      <EyeIcon className='h-5' />
    </Button>
  );
}

export function TagActions({ tag }: { tag: Tag }) {
  return (
    <ButtonGroup>
      <ViewTag id={tag.id || 0} />
    </ButtonGroup>
  );
}

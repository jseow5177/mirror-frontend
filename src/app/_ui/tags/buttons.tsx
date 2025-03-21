'use client';

import React from 'react';
import {
  TrashIcon,
  PlusIcon,
  EyeIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ButtonGroup,
  Button,
  Link,
} from '@heroui/react';
import { Tag } from '@/app/_lib/model/tag';

export function DeleteTag({ name }: { name: string }) {
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
                <Button onPress={onClose} color='default' variant='solid'>
                  Cancel
                </Button>
                <Button onPress={async () => {}} color='danger' variant='solid'>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Button isIconOnly variant='bordered' onPress={onOpen}>
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

export function UploadTag({ id }: { id: number }) {
  return (
    <Button
      isIconOnly
      variant='bordered'
      as={Link}
      href={`/dashboard/tags/${id}/upload`}
    >
      <ArrowUpTrayIcon className='h-5' />
    </Button>
  );
}

export function TagActions({ tag }: { tag: Tag }) {
  return (
    <ButtonGroup>
      <ViewTag id={tag.id || 0} />
      <UploadTag id={tag.id || 0} />
    </ButtonGroup>
  );
}

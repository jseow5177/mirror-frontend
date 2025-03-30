'use client';

import {
  verifyDomain,
  createDomain,
  CreateDomainState,
  createSender,
  CreateSenderState,
} from '@/app/_lib/action/tenant';
import { inviteUsers, InviteUsersState } from '@/app/_lib/action/user';
import { Role } from '@/app/_lib/model/role';
import { Tenant } from '@/app/_lib/model/tenant';
import { InviteUser } from '@/app/_lib/model/user';
import {
  AtSymbolIcon,
  EnvelopeIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';

export function CreateSender({ tenant }: { tenant: Tenant }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialState: CreateSenderState = {
    message: null,
    fieldErrors: {},
    error: null,
  };

  const ref = useRef<HTMLFormElement>(null);
  const [name, setName] = useState('');
  const [localPart, setLocalPart] = useState('');

  const [state, formAction, pending] = useActionState(
    createSender,
    initialState
  );

  useEffect(() => {
    if (state.fieldErrors) {
      return;
    }

    if (state.error) {
      addToast({
        title: state.error,
        color: 'danger',
      });
    } else {
      if (state.message) {
        addToast({
          title: state.message,
          color: 'success',
        });
        onClose();
      }
    }
  }, [state, onClose]);

  return (
    <>
      <Modal isOpen={isOpen} size='2xl' onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <form ref={ref}>
              <ModalHeader>Add Sender</ModalHeader>
              <ModalBody>
                <div>
                  <Input
                    id='name'
                    name='name'
                    variant='bordered'
                    className='mb-6'
                    label={
                      <div className='flex gap-2'>
                        <UserIcon className='w-5' />
                        <p>Name</p>
                      </div>
                    }
                    placeholder='Info'
                    fullWidth
                    labelPlacement='inside'
                    value={name}
                    isInvalid={state.fieldErrors?.name && true}
                    errorMessage={
                      state.fieldErrors?.name && state.fieldErrors?.name[0]
                    }
                    onValueChange={setName}
                  />

                  <Input
                    id='local_part'
                    name='local_part'
                    variant='bordered'
                    label={
                      <div className='flex gap-2'>
                        <UserIcon className='w-5' />
                        <p>Email</p>
                      </div>
                    }
                    labelPlacement='inside'
                    placeholder='info'
                    fullWidth
                    value={localPart}
                    isInvalid={state.fieldErrors?.local_part && true}
                    errorMessage={
                      state.fieldErrors?.local_part &&
                      state.fieldErrors?.local_part[0]
                    }
                    onValueChange={setLocalPart}
                    endContent={`@${tenant.ext_info.domain}`}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  variant='light'
                  onPress={onClose}
                  isDisabled={pending}
                >
                  Close
                </Button>
                <Button
                  color='primary'
                  onPress={() => {
                    startTransition(() => {
                      if (ref.current) {
                        formAction(new FormData(ref.current));
                      }
                    });
                  }}
                  isLoading={pending}
                >
                  Add
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
      <Button color='primary' onPress={onOpen}>
        Add Sender
      </Button>
    </>
  );
}

export function VerifyDomain() {
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyDomain = async () => {
    setIsLoading(true);
    const res = await verifyDomain();
    if (res.error) {
      addToast({
        title: res.error,
        color: 'danger',
      });
    }
    setIsLoading(false);
  };

  return (
    <Button
      color='danger'
      variant='ghost'
      isLoading={isLoading}
      onPress={handleVerifyDomain}
    >
      Authenticate
    </Button>
  );
}

export function CreateDomain() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialState: CreateDomainState = {
    message: null,
    fieldErrors: {},
    error: null,
  };

  const ref = useRef<HTMLFormElement>(null);
  const [domain, setDomain] = useState('');

  const [state, formAction, pending] = useActionState(
    createDomain,
    initialState
  );

  useEffect(() => {
    if (state.fieldErrors) {
      return;
    }

    if (state.error) {
      addToast({
        title: state.error,
        color: 'danger',
      });
    } else {
      if (state.message) {
        addToast({
          title: state.message,
          color: 'success',
        });
        onClose();
      }
    }
  }, [state, onClose]);

  return (
    <>
      <Modal isOpen={isOpen} size='2xl' onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <form ref={ref}>
              <ModalHeader>Add Domain</ModalHeader>
              <ModalBody>
                <Input
                  id='domain'
                  name='domain'
                  variant='bordered'
                  label={
                    <div className='flex gap-2'>
                      <AtSymbolIcon className='w-5' />
                      <p>Domain Name</p>
                    </div>
                  }
                  labelPlacement='inside'
                  fullWidth
                  value={domain}
                  isInvalid={state.fieldErrors?.domain && true}
                  errorMessage={
                    state.fieldErrors?.domain && state.fieldErrors?.domain[0]
                  }
                  onValueChange={setDomain}
                  description='Example: mydomain.com'
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  variant='light'
                  onPress={onClose}
                  isDisabled={pending}
                >
                  Close
                </Button>
                <Button
                  color='primary'
                  onPress={() => {
                    startTransition(() => {
                      if (ref.current) {
                        formAction(new FormData(ref.current));
                      }
                    });
                  }}
                  isLoading={pending}
                >
                  Add
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
      <Button color='danger' variant='ghost' onPress={onOpen}>
        Add Domain
      </Button>
    </>
  );
}

export function CreateUsers({ roles }: { roles: Role[] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialState: InviteUsersState = {
    message: null,
    fieldErrors: {},
    error: null,
  };

  const emptyUser = {
    email: '',
    role_id: 0,
  };

  const ref = useRef<HTMLFormElement>(null);
  const [newUsers, setNewUsers] = useState<InviteUser[]>([emptyUser]);

  const handleInviteUsers = (s: InviteUsersState, formData: FormData) => {
    formData.append('users', JSON.stringify(newUsers));
    return inviteUsers(s, formData);
  };

  const [state, formAction, pending] = useActionState(
    handleInviteUsers,
    initialState
  );

  const [fieldErrors, setFieldErrors] = useState(state.fieldErrors);

  const addUser = () => {
    setNewUsers([...newUsers, emptyUser]);
  };

  const removeUser = (i: number) => {
    if (newUsers.length > 1) {
      setNewUsers([...newUsers.slice(0, i), ...newUsers.slice(i + 1)]);
      setFieldErrors({
        users: [
          ...(fieldErrors?.users?.slice(0, i) || []),
          ...(fieldErrors?.users?.slice(i + 1) || []),
        ],
      });
    }
  };

  const onEmailChange = (i: number, v: string) => {
    setNewUsers([
      ...newUsers.slice(0, i),
      {
        email: v,
        role_id: newUsers[i].role_id,
      },
      ...newUsers.slice(i + 1),
    ]);
  };

  const onRoleChange = (i: number, v: string | number | null) => {
    if (!v) {
      return;
    }
    setNewUsers([
      ...newUsers.slice(0, i),
      {
        email: newUsers[i].email,
        role_id: Number(v),
      },
      ...newUsers.slice(i + 1),
    ]);
  };

  useEffect(() => {
    if (state.fieldErrors) {
      setFieldErrors(state.fieldErrors);
      return;
    }

    if (state.error) {
      addToast({
        title: state.error,
        color: 'danger',
      });
    } else {
      if (state.message) {
        addToast({
          title: state.message,
          color: 'success',
        });
        onClose();
      }
    }
  }, [state, onClose]);

  return (
    <>
      <Modal isOpen={isOpen} size='2xl' onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <form ref={ref}>
              <ModalHeader>Invite Users</ModalHeader>
              <ModalBody>
                <>
                  {newUsers.map((user, i) => {
                    const error = fieldErrors?.users && fieldErrors?.users[i];

                    return (
                      <div key={i} className='mt-2 flex items-center gap-4'>
                        <Input
                          id={`email-${i}`}
                          name={`email-${i}`}
                          variant='bordered'
                          label={
                            <div className='flex gap-2'>
                              <EnvelopeIcon className='w-5' />
                              <p>Email</p>
                            </div>
                          }
                          labelPlacement='inside'
                          fullWidth
                          value={user.email}
                          isInvalid={error?.email && true}
                          errorMessage={error?.email}
                          onValueChange={(v) => onEmailChange(i, v)}
                        />
                        <Autocomplete
                          variant='bordered'
                          label={
                            <div className='flex gap-2'>
                              <UserIcon className='w-5' />
                              <p>Role</p>
                            </div>
                          }
                          selectedKey={`${user.role_id ? user.role_id : ''}`}
                          onSelectionChange={(v) => onRoleChange(i, v)}
                          isInvalid={error?.role_id && true}
                          errorMessage={error?.role_id}
                        >
                          {roles.map((role) => (
                            <AutocompleteItem key={role.id!}>
                              {role.name}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                        <Button
                          isIconOnly
                          size='sm'
                          variant='light'
                          color='danger'
                          onPress={() => removeUser(i)}
                          isDisabled={newUsers.length === 1}
                        >
                          <TrashIcon />
                        </Button>
                      </div>
                    );
                  })}
                  <span>
                    <Link href='#' size='sm' onPress={addUser}>
                      + Add User
                    </Link>
                  </span>
                </>
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  variant='light'
                  onPress={onClose}
                  isDisabled={pending}
                >
                  Close
                </Button>
                <Button
                  color='primary'
                  onPress={() => {
                    startTransition(() => {
                      if (ref.current) {
                        formAction(new FormData(ref.current));
                      }
                    });
                  }}
                  isLoading={pending}
                >
                  Invite
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
      <Button
        color='primary'
        variant='solid'
        startContent={<PlusIcon className='h-8' />}
        onPress={onOpen}
      >
        Invite Users
      </Button>
    </>
  );
}

'use client';

import { updateRoles, UpdateRolesState } from '@/app/_lib/action/role';
import { Action, Role } from '@/app/_lib/model/role';
import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  CheckboxGroup,
  Link,
} from '@heroui/react';
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';

export default function Roles({
  roles,
  actions,
}: {
  roles: Role[];
  actions: Record<string, Action[]>;
}) {
  const initialState: UpdateRolesState = {
    message: null,
    fieldErrors: {
      roles: [],
    },
    error: null,
  };

  const formRef = useRef<HTMLFormElement>(null);

  const [userRoles, setUserRoles] = useState(roles);
  const [hasChange, setHasChange] = useState(false);

  const handleUpdateRoles = (s: UpdateRolesState, formData: FormData) => {
    formData.append('roles', JSON.stringify(userRoles));
    return updateRoles(s, formData);
  };

  const [state, formAction, pending] = useActionState(
    handleUpdateRoles,
    initialState
  );

  const handleRoleChange = (arr: string[], i: number) => {
    setUserRoles([
      ...userRoles.slice(0, i),
      {
        ...userRoles[i],
        actions: arr,
      },
      ...userRoles.slice(i + 1),
    ]);
    setHasChange(true);
  };

  useEffect(() => {
    if (state.fieldErrors?.roles && state.fieldErrors?.roles.length > 0) {
      toast.error('Fail to update roles');
      return;
    }

    if (state.error) {
      toast.error(state.error ? state.error : 'Error encountered');
    } else {
      if (state.message) {
        toast.success(state.message);
        setHasChange(false);
      }
    }
  }, [state]);

  return (
    <form ref={formRef}>
      <Accordion variant='shadow' selectionMode='multiple'>
        {userRoles.map((userRole, i) => (
          <AccordionItem
            key={i}
            title={userRole.name}
            subtitle={userRole.role_desc}
          >
            {Object.keys(actions).map((actionGroupName, j) => (
              <CheckboxGroup
                key={j}
                label={actionGroupName}
                orientation='horizontal'
                value={userRole.actions}
                className='pb-4'
                onValueChange={(arr: string[]) => handleRoleChange(arr, i)} // edit on index i
              >
                {actions[actionGroupName].map((action, k) => (
                  <Checkbox key={k} value={action.code}>
                    {action.action_desc}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            ))}
          </AccordionItem>
        ))}
      </Accordion>
      {hasChange && (
        <div className='mt-4 flex w-full justify-end gap-4'>
          <Button
            color='danger'
            as={Link}
            href='/dashboard/settings/roles'
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            color='primary'
            isLoading={pending}
            onPress={() => {
              startTransition(() => {
                if (formRef.current) {
                  formAction(new FormData(formRef.current));
                }
              });
            }}
          >
            Save
          </Button>
        </div>
      )}
    </form>
  );
}

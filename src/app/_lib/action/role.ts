'use server';

import { revalidatePath } from 'next/cache';
import axiosInstance from '../axios';
import { Role, UpdateRolesSchema } from '../model/role';
import { handleAxiosError } from '../utils';

export type UpdateRolesState = {
  fieldErrors?: {
    roles?: {
      id?: string[];
      name?: string[];
      role_desc?: string[];
      actions?: string[];
    }[];
  };
  error?: string | null;
  message?: string | null;
};

export async function updateRoles(_: UpdateRolesState, formData: FormData) {
  const roles = JSON.parse(formData.get('roles')?.toString() || '[]') as Role[];

  const fields = UpdateRolesSchema.safeParse({
    roles: roles,
  });

  if (!fields.success) {
    const errors = fields.error.format();

    const fieldErrors = Array.from({ length: roles.length }, (_, i) => {
      const error = errors.roles?.[`${i}`];

      if (!error || Array.isArray(error)) return {};

      return {
        id: error.id?._errors,
        name: error.name?._errors,
        role_desc: error.role_desc?._errors,
        actions: error.actions?._errors,
      };
    });

    return {
      fieldErrors: { roles: fieldErrors },
      error: 'Fields validation error. Failed to update.',
    };
  }

  try {
    await axiosInstance.post('/update_roles', {
      roles: fields.data?.roles,
    });
    revalidatePath('/settings/roles');

    return {
      message: 'Roles updated',
    };
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to update roles.');
    return {
      error: err.error,
    };
  }
}

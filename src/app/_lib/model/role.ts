import { z } from 'zod';

export enum RoleStatus {
  Normal = 1,
  Deleted = 2,
}

export enum ActionCode {
  EditUser = 'edit_user',
  EditRole = 'edit_role',
}

export type Role = {
  id?: number;
  name: string;
  role_desc: string;
  status: RoleStatus;
  actions: string[];
  create_time: number;
  update_time: number;
};

export type Action = {
  name: string;
  code: string;
  action_desc: string;
};

export const UpdateRolesSchema = z.object({
  roles: z.array(
    z.object({
      id: z.coerce
        .number({
          required_error: 'Role ID is required.',
          invalid_type_error: 'Role ID must be a number.',
        })
        .min(1, {
          message: 'Role ID is required',
        }),
      name: z.string({
        required_error: 'Role name is required.',
        invalid_type_error: 'Role name must be a string.',
      }),
      role_desc: z.string({
        required_error: 'Role description is required.',
        invalid_type_error: 'Role description must be a string.',
      }),
      actions: z.array(
        z.string({
          required_error: 'Role action is required.',
          invalid_type_error: 'Role action must be a string.',
        })
      ),
    })
  ),
});

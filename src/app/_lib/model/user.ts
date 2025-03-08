import { z } from 'zod';
import { Role } from './role';

export type Session = {
  token: string;
  expire_time: number;
};

export enum UserStatus {
  Pending = 1,
  Normal = 2,
  Deleted = 3,
}

export const UserStatuses: Record<UserStatus, string> = {
  [UserStatus.Pending]: 'Invited',
  [UserStatus.Normal]: 'Active',
  [UserStatus.Deleted]: 'Deleted',
};

export const getUserStatus = (value: string): UserStatus | undefined => {
  return (Object.keys(UserStatuses) as unknown as UserStatus[]).find(
    (key) => UserStatuses[key] === value
  );
};

export type InviteUser = {
  email: string;
  role_id: number;
};

export type User = {
  id: number;
  email: string;
  username: string;
  status: UserStatus;
  create_time: number;
  update_time: number;

  role: Role;
};

export const LogInSchema = z.object({
  tenant_name: z
    .string({
      required_error: 'Tenant name is required.',
      invalid_type_error: 'Tenant name must be a string.',
    })
    .min(1, { message: 'Tenant name is required.' }),
  username: z
    .string({
      required_error: 'Username is required.',
      invalid_type_error: 'Username must be a string.',
    })
    .min(1, { message: 'Username is required.' }),
  password: z
    .string({
      required_error: 'Password is required.',
      invalid_type_error: 'Password must be a string.',
    })
    .min(1, { message: 'Password is required.' }),
});

export const InitUserSchema = z.object({
  token: z
    .string({
      required_error: 'Token is required.',
      invalid_type_error: 'Token must be a string.',
    })
    .min(1, { message: 'Token is required.' }),
  password: z
    .string({
      required_error: 'Password is required.',
      invalid_type_error: 'Password must be a string.',
    })
    .min(1, { message: 'Password is required.' }),
});

export const InviteUsersSchema = z.object({
  users: z
    .array(
      z.object({
        email: z
          .string({
            required_error: 'Email is required.',
            invalid_type_error: 'Email must be a string.',
          })
          .email('Not a valid email.'),
        role_id: z.coerce
          .number({
            required_error: 'Role ID is required.',
            invalid_type_error: 'Role ID must be a number.',
          })
          .min(1, {
            message: 'Role ID is required',
          }),
      })
    )
    .min(1, {
      message: 'Must have at least one user',
    }),
});

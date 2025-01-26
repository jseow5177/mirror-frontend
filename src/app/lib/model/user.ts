import { z } from 'zod';

export type Session = {
  token: string;
  expire_time: number;
};

export type User = {
  id: number;
  create_time: number;
  update_time: number;
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

import { z } from 'zod';

export enum EmailStatus {
  Normal = 1,
  Deleted = 2,
}

export const EmailStatuses: Record<EmailStatus, string> = {
  [EmailStatus.Normal]: 'Normal',
  [EmailStatus.Deleted]: 'Deleted',
};

export type Email = {
  id?: number;
  name: string;
  email_desc: string;
  json: string;
  html: string;
  img?: string;
  status: EmailStatus;
  create_time: number;
  update_time: number;
};

export const EmailSchema = z.object({
  id: z.coerce.number({
    required_error: 'Email ID is required.',
    invalid_type_error: 'Email ID must be a number.',
  }),
  name: z
    .string({
      required_error: 'Email name is required.',
      invalid_type_error: 'Email name must be a string.',
    })
    .min(1, { message: 'Email name is required.' })
    .max(60, {
      message: 'Email name cannot be more than 64 characters long.',
    }),
  email_desc: z
    .string({
      required_error: 'Email description is required',
      invalid_type_error: 'Email description must be a string.',
    })
    .min(1, { message: 'Email description is required.' })
    .max(200, {
      message: 'Email description cannot be more than 120 characters long.',
    }),
  json: z.string({
    required_error: 'Json is required.',
    invalid_type_error: 'Json must be a string.',
  }),
  html: z.string({
    required_error: 'Html is required.',
    invalid_type_error: 'Html must be a string.',
  }),
});

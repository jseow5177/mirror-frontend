import { z } from 'zod';

export enum TenantStatus {
  Normal = 1,
  Deleted = 2,
}

export type Sender = {
  id: number;
  tenant_id: number;
  name: string;
  local_part: string;
  create_time: number;
  update_time: number;

  email: string;
};

export type DnsRecords = Record<
  string,
  Record<string, string | boolean> | null
>;

export type TenantExtInfo = {
  folder_id: string;
  domain: string;
  dns_records: DnsRecords;
  is_domain_valid: boolean;
};

export type Tenant = {
  id: number;
  name: string;
  status: TenantStatus;
  ext_info: TenantExtInfo;
  create_time: number;
  update_time: number;
};

export const DomainSchema = z.object({
  domain: z
    .string({
      required_error: 'Domain is required.',
      invalid_type_error: 'Domain must be a string.',
    })
    .min(1, { message: 'Domain is required.' })
    .regex(/^([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/, {
      message: 'Invalid domain format. Example: mydomain.com',
    }),
});

export const SenderSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required.',
      invalid_type_error: 'Name must be a string.',
    })
    .min(1, { message: 'Name is required.' }),
  local_part: z
    .string({
      required_error: 'Email is required.',
      invalid_type_error: 'Email must be a string.',
    })
    .min(1, { message: 'Email is required.' })
    .regex(/^[a-zA-Z0-9._%+-]+$/, {
      message: 'Invalid format.',
    }),
});

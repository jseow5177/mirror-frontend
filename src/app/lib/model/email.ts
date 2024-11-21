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
  blob: string;
  status: EmailStatus;
  create_time: number;
  update_time: number;
};

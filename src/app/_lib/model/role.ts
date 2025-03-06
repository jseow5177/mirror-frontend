export enum RoleStatus {
  Normal = 1,
  Deleted = 2,
}

export type Role = {
  id?: number;
  name: string;
  role_desc: string;
  status: RoleStatus;
  actions: Action[];
  create_time: number;
  update_time: number;
};

export type Action = {
  name: string;
  code: string;
  action_desc: string;
};

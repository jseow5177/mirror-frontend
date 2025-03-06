import axiosInstance from '../axios';
import { Action, Role } from '../model/role';
import { handleAxiosError } from '../utils';

type GetActionsResponse = {
  actions: Action[];
};

export async function getActions() {
  try {
    const resp = await axiosInstance.post('/get_actions', {});

    const body: GetActionsResponse = resp.data.body;

    return body.actions;
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to get actions.');
    throw new Error(err.error);
  }
}

type GetRolesResponse = {
  roles: Role[];
};

export async function getRoles() {
  try {
    const resp = await axiosInstance.post('/get_roles', {});

    const body: GetRolesResponse = resp.data.body;

    return body.roles;
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to get roles.');
    throw new Error(err.error);
  }
}

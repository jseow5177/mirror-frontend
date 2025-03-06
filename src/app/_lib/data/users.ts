import axiosInstance from '../axios';
import { getUserStatus, User, UserStatus } from '../model/user';
import { handleAxiosError } from '../utils';
import { Pagination } from './tag';

type GetUsersResponse = {
  users: User[];
  pagination: Pagination;
};

const USERS_PER_PAGE = 10;

export async function getUsers(
  currentPage?: number,
  keyword?: string,
  status?: string[]
): Promise<[GetUsersResponse, number]> {
  try {
    const userStatus = status
      ?.map((status) => Number(getUserStatus(status)))
      .filter((status): status is UserStatus => !isNaN(status)); // set to number

    const resp = await axiosInstance.post('/get_users', {
      keyword: keyword,
      status: userStatus,
      pagination: {
        page: currentPage,
        limit: USERS_PER_PAGE,
      },
    });

    const body: GetUsersResponse = resp.data.body;

    return [body, Math.ceil((body.pagination.total || 0) / USERS_PER_PAGE)];
  } catch (error) {
    const err = handleAxiosError(error, 'Failed to get users.');
    throw new Error(err.error);
  }
}

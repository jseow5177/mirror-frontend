import axiosInstance from './axios';
import { handleAxiosError } from './utils';
import { Pagination } from './tag-data';
import { Email } from './model/email';

type GetEmailsResponse = {
  emails: Email[];
  pagination: Pagination;
};

const EMAILS_PER_PAGE = 5;

export async function getEmails(
  currentPage?: number,
  keyword?: string
): Promise<[GetEmailsResponse, number]> {
  try {
    const resp = await axiosInstance.post('/get_emails', {
      name: keyword,
      desc: keyword,
      pagination: {
        page: currentPage,
        limit: EMAILS_PER_PAGE,
      },
    });

    const body: GetEmailsResponse = resp.data.body;

    return [body, Math.ceil((body.pagination.total || 0) / EMAILS_PER_PAGE)];
  } catch (error) {
    const err = handleAxiosError(error, 'Fail to get emails.');
    throw new Error(err.error);
  }
}

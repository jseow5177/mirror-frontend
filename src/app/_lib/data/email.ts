'use server';

import axiosInstance from '../axios';
import { handleAxiosError } from '../utils';
import { Pagination } from './tag';
import { Email } from '../model/email';

type GetEmailResponse = {
  email: Email;
}

type GetEmailsResponse = {
  emails: Email[];
  pagination: Pagination;
};

const EMAILS_PER_PAGE = 5;

export async function getEmail(
  id: number
): Promise<Email> {
  try {
    const resp = await axiosInstance.post('/get_email', {
      "email_id": id,
    });

    const body: GetEmailResponse = resp.data.body;

    return body.email;
  } catch (error) {
    const err = handleAxiosError(error, 'Fail to get email.');
    throw new Error(err.error);
  }
}

export async function getEmails(
  currentPage?: number,
  keyword?: string
): Promise<[GetEmailsResponse, number]> {
  try {
    const resp = await axiosInstance.post('/get_emails', {
      keyword: keyword,
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

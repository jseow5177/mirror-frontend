import { Criteria } from './model/segment';
import axios from 'axios';
import { notFound, redirect } from 'next/navigation';

export const cookieSetting = {
  name: 'session',
  options: {
    httpOnly: true,
    secure: false,
    path: '/',
  },
};

export const baseUrl =
  process.env.BACKEND_URL || 'http://localhost:8080/api/v1';

export const convertUnixToLocalTime = (unixMilliseconds: number) => {
  const date = new Date(unixMilliseconds * 1000);

  const dateString = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeString = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return { date: dateString, time: timeString };
};

export function validateCriteria(criteria: Criteria): boolean {
  if (!Array.isArray(criteria.queries) || criteria.queries.length === 0) {
    console.log('criteria has empty queries');
    return false;
  }

  for (const query of criteria.queries) {
    for (const lookup of query.lookups) {
      if (!lookup.tag_id || !lookup.op || !lookup.val) {
        return false;
      }
    }

    if (!query.op) {
      return false;
    }
  }

  if (!criteria.op) {
    return false;
  }

  return true;
}

export const handleAxiosError = (
  err: any,
  defaultErrMsg?: string
): { error: string } => {
  if (axios.isAxiosError(err) && err.response) {
    let errMsg = defaultErrMsg ? defaultErrMsg : 'Error encountered.';

    const { status, data } = err.response;

    switch (status) {
      // use backend error messages for certain codes
      case axios.HttpStatusCode.Conflict:
      case axios.HttpStatusCode.UnprocessableEntity:
        errMsg = data.error || errMsg;
        break;
      case axios.HttpStatusCode.Unauthorized:
        redirect('/');
      case axios.HttpStatusCode.NotFound:
        notFound();
    }

    console.log(`code: ${status}, err: ${err.response.data.error}`);

    return {
      error: errMsg,
    };
  } else {
    return {
      error: err.message === '' ? 'Something bad has happened!' : err.message,
    };
  }
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

import { Criteria } from './model/segment';
import axios from 'axios';

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
      if (!lookup.tag_id || (!lookup.eq && !lookup.in && !lookup.range)) {
        console.log('lookup fields are incomplete');
        return false;
      }

      if (lookup.eq && lookup.eq === '') {
        console.log('lookup eq is empty');
        return false;
      }

      if (lookup.in && lookup.in.length === 0) {
        console.log('lookup in is empty');
        return false;
      }

      if (lookup.range) {
        if (
          !lookup.range.gt &&
          !lookup.range.gte &&
          !lookup.range.lt &&
          !lookup.range.lte
        ) {
          console.log('lookup range is empty');
          return false;
        }
      }
    }

    if (!query.op) {
      console.log('query op is missing');
      return false;
    }
  }

  if (!criteria.op) {
    console.log('criteria op is missing');
    return false;
  }

  return true;
}

export const handleAxiosError = (err: any, defaultErrMsg?: string) => {
  if (axios.isAxiosError(err) && err.response) {
    let errMsg = defaultErrMsg ? defaultErrMsg : 'Error encountered.';

    const { status, data } = err.response;

    if (status === axios.HttpStatusCode.UnprocessableEntity) {
      errMsg = data.error || errMsg;
    }

    console.log(`code: ${status}, err: ${err.response.data.error}`);

    return {
      error: errMsg,
    };
  } else {
    return {
      error: err instanceof Error ? err.message : String(err),
    };
  }
};

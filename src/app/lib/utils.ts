import { Criteria } from "./model/segment";

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export const convertUnixToLocalTime = (unixMilliseconds: number) => {
  const date = new Date(unixMilliseconds);

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export function validateCriteria(c: string): boolean {
  const criteria: Criteria = JSON.parse(c);

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

      if (lookup.eq && lookup.eq === "") {
        console.log('lookup eq is empty');
        return false;
      }

      if (lookup.in && lookup.in.length === 0) {
        console.log('lookup in is empty');
        return false;
      }

      if (lookup.range) {
        if (!lookup.range.gt && !lookup.range.gte && !lookup.range.lt && !lookup.range.lte) {
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

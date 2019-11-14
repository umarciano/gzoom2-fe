import * as moment from 'moment';

const ISO_8601_DATE = 'YYYY-MM-DD';
const ISO_8601_DATETIME = 'YYYY-MM-DDTHH:mm:ss';

/**
 * Converts a string that represents a date in ISO8601 format into a Date object.
 * @param d The string representing the date.
 * @returns The date object
 */
export function dtoToDate(d: Date | string | null): Date | null {
  if (typeof d === 'string') {
    const m = moment(d, ISO_8601_DATE);
    if (m.isValid()) {
      return m.toDate();
    }
    console.error('Cannot convert date from ISO8601 format', {date: d});
    return null;
  }
  return d;
}

/**
 * Converts a string that represents a date and time in ISO8601 format into a Date object.
 * @param d The string representing the date.
 * @returns The date object
 */
export function dtoToDateTime(d: Date | string | null): Date | null {
  if (typeof d === 'string') {
    const m = moment(d, ISO_8601_DATETIME);
    if (m.isValid()) {
      return m.toDate();
    }
    console.error('Cannot convert date from ISO8601 format', {date: d});
    return null;
  }
  return d;
}



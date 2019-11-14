import {Optional, Pipe, PipeTransform} from '@angular/core';

import * as moment from 'moment';
import 'moment-timezone';

import {I18NService} from './i18n.service';

/**  p-calendar require
 *  Following options can be a part of the format.
d - day of month (no leading zero)
dd - day of month (two digit)
o - day of the year (no leading zeros)
oo - day of the year (three digit)
D - day name short
DD - day name long
m - month of year (no leading zero)
mm - month of year (two digit)
M - month name short
MM - month name long
y - year (two digit)
yy - year (four digit)
@ - Unix timestamp (ms since 01/01/1970)
! - Windows ticks (100ns since 01/01/0001)
'...' - literal text
'' - single quote
anything else - literal text*/

const DEFAULT_FORMATS = {
  TIMESTAMP: 'll LTS',
  DATETIME: 'DD/MM/YYYY, LTS',
  DATE: 'DD/MM/YYYY'
};

const DEFAULT_TIMEZONE = 'Europe/Rome';

@Pipe({name: 'i18n'})
export class I18NPipe implements PipeTransform {

  constructor(private readonly i18nService: I18NService) {
  }

  transform(value: string, ...args: any[]): any {
    return this.i18nService.translate(value, ...args);
  }

}

@Pipe({name: 'i18nNum'})
export class I18NNumPipe implements PipeTransform {

  constructor(private readonly i18nService: I18NService) {
  }

  transform(value: string, ...args: any[]): any {
    return this.i18nService.getFormat(value, ...args);
  }

}

@Pipe({name: 'i18nParse'})
export class I18NParsePipe implements PipeTransform {

  constructor() {}

  // value is assumed to be a string in ISO 8601 format
  transform(value: string): moment.Moment | null {
    return value ? moment(value) : null;
  }

}

@Pipe({name: 'i18nDate'})
export class I18NDatePipe implements PipeTransform {

  constructor(private readonly i18n: I18NService) {
  }

  transform(value: Date | moment.Moment): string | null {
    const timeZone = timezoneOrDefault();
    return value ? moment(value).tz(timeZone).format(this.i18n.dateShortFormat(DEFAULT_FORMATS.DATE)) : null;
  }

}

@Pipe({name: 'i18nDateTime'})
export class I18NDateTimePipe implements PipeTransform {

  constructor(private readonly i18n: I18NService) {
  }

  transform(value: Date | moment.Moment): string | null {
    const timeZone = timezoneOrDefault();
    return value ? moment(value).tz(timeZone).format(this.i18n.dateTimeShortFormat(DEFAULT_FORMATS.DATETIME)) : null;
  }

}

@Pipe({name: 'i18nTimestamp'})
export class I18NTimestampPipe implements PipeTransform {

  constructor(private readonly i18n: I18NService) {
  }

  // value is assumed to be a valid `moment` object
  transform(value: Date | moment.Moment): string | null {
    const timeZone = timezoneOrDefault();
    return value ? moment(value).tz(timeZone).format(this.i18n.timestampFormat(DEFAULT_FORMATS.TIMESTAMP)) : null;
  }

}

function timezoneOrDefault() {
  return DEFAULT_TIMEZONE;
}

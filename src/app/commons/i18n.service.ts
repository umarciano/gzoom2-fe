import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { isBlank, format, isString } from './commons';

interface Localizations {
  language?: string;
  translations: { [x: string]: string; };
  formats: { [x: string]: string | number | boolean; };
}

export class I18NConfig {
  readonly rootPath = '../rest'; // FIXME this is a duplicate of api-config.ts
  localizations: Localizations;
}

/**
 * Provides a function that when executed will load the localization
 * data and return true when finished.
 * Localization data is copied into the config class.
 *
 * @param  {Http}       http   Angular Http service
 * @param  {I18NConfig} config I18N (partial configuration)
 * @return {function} A function that loads the localization data
 */
export function load(http: Http, config: I18NConfig) {
  return () => http
    .get(`${config.rootPath}/profile/i18n`)
    .toPromise()
    .then(res => {
      config.localizations = res.json() as Localizations;
      return true;
    })
    .catch(err => {
      console.log('No way to get the localization data', err);
      return true;
    });
}

const NEW_LINES_RE = /\s*(\r\n|\n|\r)\s*/gm;
const SUFFIX_RE = /^((?:.|\s)+)__\{([-\w]+)\}$/; // see https://regex101.com/r/bZ6iU3/2

/**
 * A service to perform translations and internationalizations of strings, numbers and dates.
 */
@Injectable()
export class I18NService {
  private readonly _t: { [x: string]: string; };
  private readonly _f: { [x: string]: string | number | boolean; };

  private static removeSuffix(text) {
    const matches = SUFFIX_RE.exec(text);
    return matches ? matches[1] : text;
  }

  constructor(private config: I18NConfig) {
    this._t = config.localizations.translations;
    this._f = config.localizations.formats;
  }

  /**
   * Translates a label.
   *
   * @param text {String} The input label, possibly including format placeholders and an
   *                      optional suffix to better identify the context.
   *                      Placeholders have the following format:
   *                          {n} where n is a 0-based index of the value argument
   *                      Suffix has the following format:
   *                          __{letters} where letters are alpha-numeric characters
   * @param * {Object} The remaining parameters are used in value substitution of placeholders
   * @returns {string} The localized string, with placeholders substituted by input values eventually
   */
  translate(text: string) {
    const text2 = text.replace(NEW_LINES_RE, ' '); // sanity fix
    const trans = this._t[text2];
    const fmt = !isBlank(trans) ? trans : I18NService.removeSuffix(text2);
    const args_len = arguments.length;
    const args = [fmt];

    // workaround for Chrome, don't use Array.prototype.slice.call(arguments,1)
    // or it will give birth to memory leakages
    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
    // http://www.reddit.com/r/javascript/comments/2eppid/fastest_way_to_slice_arguments_in_javascript/
    if (args_len > 1) {
      for (let i = 1; i < args_len; i++) {
        args.push(arguments[i]);
      }
    }

    return format.apply(null, args);
  }

  /**
   * Retrieves the first day of the week supplied with the localization formats or the default one
   * if none was specified.
   *
   * @param defDay The default day of week
   * @returns {number} The default day of the week
   */
  firstDay(defDay: number): number {
    const f: any = this._f['first-day'];
    return isFinite(f) ? (isString(f) ? parseInt(f, 10) : f) : defDay;
  }

  /**
   * Retrieves the short date formats supplied with the localization data or the default one if none
   * was specified.
   *
   * @param defFmt The default short date format.
   * @returns {string} The short date format
   */
  dateShortFormat(defFmt) {
    const f: string = this._f['date-short'] as string;
    return !isBlank(f) ? f : defFmt;
  }
}

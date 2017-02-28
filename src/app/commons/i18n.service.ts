import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

interface Localizations {
  language?: string;
  translations: { [x: string]: string; };
  formats: { [x: string]: string|number|boolean; };
}

export class I18NConfig {
  readonly rootPath: string = '../rest'; // FIXME this is a duplicate of api-config.ts
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


@Injectable()
export class I18NService {

  constructor(private http: Http, private i18nConfig: I18NConfig) { }
}

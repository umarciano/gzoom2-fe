import { Pipe, PipeTransform } from '@angular/core';

import { I18NService } from './i18n.service';
import { isString } from './commons';

@Pipe({ name: 'i18n' })
export class I18NPipe implements PipeTransform {

  constructor(private readonly i18nService: I18NService) { }

  transform(value: string, ...args: any[]): any {
    return this.i18nService.translate(value, ...args);
  }

}

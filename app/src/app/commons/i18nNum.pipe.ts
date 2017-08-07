import { Pipe, PipeTransform } from '@angular/core';

import { I18NService } from './i18n.service';
import { isString } from './commons';

@Pipe({ name: 'i18nNum' })
export class I18NNumPipe implements PipeTransform {

  constructor(private readonly i18nService: I18NService) { }

  transform(value: string, ...args: any[]): any {
    return this.i18nService.getFormat(value, ...args);
  }

}

import { Pipe, PipeTransform } from '@angular/core';

import { DatePipe } from '@angular/common';
import { I18NService } from './i18n.service';

@Pipe({ name: 'i18nDate' })
export class i18NDatePipe implements PipeTransform {
  constructor(private readonly i18nService: I18NService) { }

  transform(value: string, ...args: any[]): any {
    return this.i18nService.getFormat(value, ...args);
  }

}
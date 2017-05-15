import { Injectable } from '@angular/core';

import * as _ from 'lodash';

const REFURBISHED_PAGES = ['']; // TODO

@Injectable()
export class MenuRefurbishService {
  private readonly refurbishedPages: string[];

  constructor() {
    this.refurbishedPages = _.sortedUniq(REFURBISHED_PAGES);
  }

  isRefurbished(id: string) {

  }

}

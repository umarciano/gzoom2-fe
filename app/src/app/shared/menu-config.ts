import * as _ from 'lodash';

const REFURBISHED_PAGES = ['']; // TODO

export class MenuConfig {
  private readonly refurbishedPages: string[];

  constructor() {
    this.refurbishedPages = _.sortedUniq(REFURBISHED_PAGES);
  }

  isRefurbished(id: string) {

  }

}

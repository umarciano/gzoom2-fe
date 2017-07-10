import { Injectable } from '@angular/core';

import * as _ from 'lodash';

import { LeafMenu } from '../api/dto';

/**
 * Maps of refurbished pages and their relative router states.
 */
const REFURBISHED_PAGES = {
  'GP_MENU_00001_A.1': ['example'],
  'GP_MENU_00001_1': ['example'],
  'GP_MENU_00001_2': ['dashboard'],
  'GP_MENU_00001_3': ['example'],
  'GP_MENU_00006': ['uom/type'],
  'GP_MENU_00332': ['uom/value']
};

@Injectable()
export class MenuService {

  stateFor(menu: LeafMenu): string[] {
    const ref = REFURBISHED_PAGES[menu.id];
    if (ref) {
      return ref;
    } else {
      return ['legacy', menu.id];
    }
  }

}

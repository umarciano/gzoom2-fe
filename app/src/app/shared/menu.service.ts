import { Injectable } from '@angular/core';

import * as _ from 'lodash';

import { LeafMenu } from '../api/dto';
/*
import { faTachometerAlt,
  faTasks,
  faChartLine,
  faCogs
} from '@fortawesome/fontawesome-free-solid';
import { library } from '@fortawesome/fontawesome';*/

/**
 * Maps of refurbished pages and their relative router states.
 */
const REFURBISHED_PAGES = {
  'GP_MENU_00001_A.1': ['example'],
  'GP_MENU_00001_1': ['example'],
  'GP_MENU_00001_2': ['dashboard'],
  'GP_MENU_00001_3': ['example'],
  'GP_MENU_00332': ['uom/value'],
  'GP_MENU_00334': ['timesheet'], // 'GP_MENU_00334': ['timesheet/timesheet'],
  'GP_MENU_00347': ['uom/type'],
  'GP_MENU_00999': ['report-example-1'] // 'GP_MENU_00999': ['timesheet/timesheet-report/CTX_PR']
};

@Injectable()
export class MenuService {
  constructor() { 
    /*library.add(faTachometerAlt);
    library.add(faTasks);
    library.add(faChartLine);
    library.add(faCogs);*/
  }

  stateFor(menu: LeafMenu): string[] {
    const ref = REFURBISHED_PAGES[menu.id];
    if (ref) {
      return ref;
    } else {
      return ['legacy', menu.id];
    }
  }

}

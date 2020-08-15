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
  'GP_MENU_00348': ['visitor'],
  'GP_MENU_00444': ['report-print/CTX_CO'],
  'GP_MENU_00445': ['report-print/CTX_BS'],
  'GP_MENU_00446': ['report-print/CTX_OR'],
  'GP_MENU_00447': ['report-print/CTX_EP'],
  'GP_MENU_00448': ['report-print/CTX_GD'],
  'GP_MENU_00449': ['report-print/CTX_TR'],
  'GP_MENU_00486': ['queryconfig'],
  'GP_MENU_00487': ['queryconfig/CTX_CO/E'],
  'GP_MENU_00488': ['queryconfig/CTX_BS/E'],
  'GP_MENU_00489': ['queryconfig/CTX_OR/E'],
  'GP_MENU_00490': ['queryconfig/CTX_EP/E'],
  'GP_MENU_00491': ['queryconfig/CTX_GD/E'],
  'GP_MENU_00492': ['queryconfig/CTX_TR/E'],
  'GP_MENU_00493': ['queryconfig/CTX_CO/U'],
  'GP_MENU_00494': ['queryconfig/CTX_BS/U'],
  'GP_MENU_00495': ['queryconfig/CTX_OR/U'],
  'GP_MENU_00496': ['queryconfig/CTX_EP/U'],
  'GP_MENU_00497': ['queryconfig/CTX_GD/U'],
  'GP_MENU_00498': ['queryconfig/CTX_TR/U'],
  'GP_MENU_00999': ['report-print'] // 'GP_MENU_00999': ['timesheet/timesheet-report/CTX_PR']
};

@Injectable()
export class MenuService {
  constructor() {
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

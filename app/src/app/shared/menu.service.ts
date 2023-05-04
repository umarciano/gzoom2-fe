import { Injectable } from '@angular/core';

import * as _ from 'lodash';

import { FolderMenu, LeafMenu } from '../commons/model/dto';
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

  // CTX_BA
  'GP_MENU_00332': ['CTX_BA/uom'],
  'GP_MENU_00334': ['CTX_BA/timesheet'], // 'GP_MENU_00334': ['timesheet/timesheet'],
  'GP_MENU_00347': ['CTX_BA/uom/type'],
  'GP_MENU_00348': ['CTX_BA/visitor'],
  'GP_MENU_00561': ['CTX_BA/interfacciamentoDati'],
  'GP_MENU_00999': ['CTX_BA/report-print'],
  'GP_MENU_00486': ['CTX_BA/queryconfig'],
  'GP_MENU_00566': ['CTX_BA/periodType'],
  'GP_MENU_00567': ['CTX_BA/typology-relationships-objectives'],
  'GP_MENU_00568': ['CTX_BA/objective-codes'],
  'GP_MENU_00569': ['CTX_BA/subsystem-types'],
  'GP_MENU_00570': ['CTX_BA/detection-type'],
  

  
  // REPORT-PRINT
  'GP_MENU_00444': ['CTX_CO/report-print'],
  'GP_MENU_00445': ['CTX_BS/report-print'],
  'GP_MENU_00446': ['CTX_OR/report-print'],
  'GP_MENU_00447': ['CTX_EP/report-print'],
  'GP_MENU_00448': ['CTX_GD/report-print'],
  'GP_MENU_00449': ['CTX_TR/report-print'],
  'GP_MENU_00499': ['CTX_PA/report-print'],
  'GP_MENU_00500': ['CTX_DI/report-print'],
  'GP_MENU_00501': ['CTX_RE/report-print'],
  'GP_MENU_00502': ['CTX_CG/report-print'],
  'GP_MENU_00503': ['CTX_PR/report-print'],

  // QUERYCONFIG
  'GP_MENU_00487': ['CTX_CO/queryconfig/E'],
  'GP_MENU_00488': ['CTX_BS/queryconfig/E'],
  'GP_MENU_00489': ['CTX_OR/queryconfig/E'],
  'GP_MENU_00490': ['CTX_EP/queryconfig/E'],
  'GP_MENU_00491': ['CTX_GD/queryconfig/E'],
  'GP_MENU_00492': ['CTX_TR/queryconfig/E'],
  'GP_MENU_00504': ['CTX_PA/queryconfig/E'],
  'GP_MENU_00505': ['CTX_DI/queryconfig/E'],
  'GP_MENU_00506': ['CTX_RE/queryconfig/E'],
  'GP_MENU_00507': ['CTX_CG/queryconfig/E'],
  'GP_MENU_00508': ['CTX_PR/queryconfig/E'],
  'GP_MENU_00543': ['CTX_AC/queryconfig/E'],
  'GP_MENU_00545': ['CTX_PY/queryconfig/E'],
  'GP_MENU_00493': ['CTX_CO/queryconfig/A'],
  'GP_MENU_00494': ['CTX_BS/queryconfig/A'],
  'GP_MENU_00495': ['CTX_OR/queryconfig/A'],
  'GP_MENU_00496': ['CTX_EP/queryconfig/A'],
  'GP_MENU_00497': ['CTX_GD/queryconfig/A'],
  'GP_MENU_00498': ['CTX_TR/queryconfig/A'],
  'GP_MENU_00509': ['CTX_PA/queryconfig/A'],
  'GP_MENU_00510': ['CTX_DI/queryconfig/A'],
  'GP_MENU_00511': ['CTX_RE/queryconfig/A'],
  'GP_MENU_00512': ['CTX_CG/queryconfig/A'],
  'GP_MENU_00513': ['CTX_PR/queryconfig/A'],
  'GP_MENU_00544': ['CTX_AC/queryconfig/A'],
  'GP_MENU_00546': ['CTX_PY/queryconfig/A'],

  // ANALYSIS
  'GP_MENU_00550': ['CTX_BS/analysis'],
  'GP_MENU_00551': ['CTX_OR/analysis'],
  'GP_MENU_00552': ['CTX_EP/analysis'],
  'GP_MENU_00553': ['CTX_DI/analysis'],
  'GP_MENU_00554': ['CTX_PA/analysis'],
  'GP_MENU_00555': ['CTX_CO/analysis'],
  'GP_MENU_00556': ['CTX_PR/analysis'],
  'GP_MENU_00557': ['CTX_GD/analysis'],
  'GP_MENU_00558': ['CTX_CG/analysis'],
  'GP_MENU_00559': ['CTX_TR/analysis'],
  'GP_MENU_00560': ['CTX_RE/analysis'],

  'GP_MENU_00562': ['CTX_OR/timesheet'],
  'GP_MENU_00563': ['CTX_PR/timesheet'],

  

  
  // 'GP_MENU_00999': ['timesheet/timesheet-report/CTX_PR']
};

@Injectable()
export class MenuService {
  constructor() {
  }

  stateFor(context: FolderMenu, menu: FolderMenu, leaf: LeafMenu): string[] {
    const ref = REFURBISHED_PAGES[leaf.id];
    if (ref) {
      return ref;
    } else {
      return ['legacy', context.id, menu.id, leaf.id];
    }
  }
}

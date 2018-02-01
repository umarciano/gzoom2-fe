import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { LockoutService } from '../../../commons/lockout.service';
import { TimesheetService } from '../../../api/timesheet.service';
import { TimeEntry } from './time_entry';
import { WorkEffort } from './work_effort';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class WorkEffortResolver implements Resolve<void | WorkEffort[]> {

  constructor(
    private readonly timesheetService: TimesheetService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | WorkEffort[]> {
    var id = route.paramMap.get('id');
    console.log('resolve workEfforts');
    return this.timesheetService
    .workEfforts(id)
    .toPromise()
    .then(workEfforts => { return workEfforts; })
    .catch(err => {
      console.error('Cannot retrieve workEfforts', err);
      this.lockoutService.lockout();
    });
  }
}



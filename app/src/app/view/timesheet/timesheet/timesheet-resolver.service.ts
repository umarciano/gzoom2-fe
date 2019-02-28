import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';


import { LockoutService } from '../../../commons/lockout.service';
import { TimesheetService } from '../../../api/timesheet.service';
import { Timesheet } from './timesheet';

import { DatePipe } from '@angular/common';
/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class TimesheetResolver implements Resolve<void | Timesheet[]> {

  constructor(
    private readonly timesheetService: TimesheetService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | Timesheet[]> {
    console.log('resolve timesheets');
    return this.timesheetService
      .timesheets()
      .toPromise()
      .then(timesheets => { return timesheets; })
      .catch(err => {
        console.error('Cannot retrieve timesheets', err);
        this.lockoutService.lockout();
      });
  }
}

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { LockoutService } from '../../../commons/lockout.service';
import { TimesheetService } from '../../../api/timesheet.service';
import { TimeEntry } from './time_entry';
import { Timesheet } from '../timesheet/timesheet';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class TimeEntryResolver implements Resolve<Timesheet[]> {

  constructor(
    private readonly timesheetService: TimesheetService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Timesheet[]> {
    //var id = route.paramMap.get('id');
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



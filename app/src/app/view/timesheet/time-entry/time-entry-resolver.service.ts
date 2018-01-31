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
export class TimeEntryResolver implements Resolve<void | TimeEntry[]> {

  constructor(
    private readonly timesheetService: TimesheetService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | TimeEntry[]> {
    var id = route.paramMap.get('id');
    console.log('resolve timeEntries for timesheetId = ' + id);
    return this.timesheetService
    .timeEntries(id)
    .toPromise()
    .then(timesheets => { return timesheets; })
    .catch(err => {
      console.error('Cannot retrieve timesheets', err);
      this.lockoutService.lockout();
    });
  }
}



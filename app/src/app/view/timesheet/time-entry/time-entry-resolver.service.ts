import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';


import { LockoutService } from '../../../commons/service/lockout.service';
import { TimesheetService } from '../../../api/service/timesheet.service';
import { TimeEntry } from '../../../api/model/time_entry';
import { Timesheet } from '../../../api/model/timesheet';

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

    const timesheetService$ = this.timesheetService.timeEntries(id)
    return lastValueFrom(timesheetService$).then(timesheets => { return timesheets; })
      .catch(err => {
        console.error('Cannot retrieve timesheets', err);
        this.lockoutService.lockout();
      });


    // return this.timesheetService
    // .timeEntries(id)
    // .toPromise()
    // .then(timesheets => { return timesheets; })
    // .catch(err => {
    //   console.error('Cannot retrieve timesheets', err);
    //   this.lockoutService.lockout();
    // });
  }
}



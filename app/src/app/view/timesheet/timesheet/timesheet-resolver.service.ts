import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { LockoutService } from '../../../commons/lockout.service';
import { TimesheetService } from '../../../api/timesheet.service';
import { Timesheet } from './timesheet';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class TimesheetResolver implements Resolve<Timesheet[]> {

  constructor(
    private readonly timesheetService: TimesheetService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Timesheet[]> {
    console.log('resolve timesheet');
    return this.timesheetService
      .timesheets()
      .toPromise()
      .then(timesheets => { return timesheets; })
      .catch(err => { // TODO devo fare il lockout?
        console.error('Cannot retrieve timesheet', err);
        this.lockoutService.lockout(); // TODO cos'e?
      });
  }
}

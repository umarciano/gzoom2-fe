import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LockoutService } from '../../../../commons/service/lockout.service';
import { TimesheetService } from '../../../../api/service/timesheet.service';
import { Timesheet } from '../../../../api/model/timesheet';
import { AuthService, UserProfile } from 'app/commons/service/auth.service';
/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class TimesheetTableResolver implements Resolve<void | Timesheet[]> {

  user: UserProfile;

  constructor(
    private readonly timesheetService: TimesheetService,
    private readonly lockoutService: LockoutService,
    private readonly authSrv: AuthService,
  ) {
    this.user = authSrv.userProfile();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | Timesheet[]> {
    console.log('resolve timesheets');
    var context = route.params.context;

    const timesheetService$ = this.timesheetService.timesheets(context);
    return lastValueFrom(timesheetService$).then(timesheets => { return timesheets; })
      .catch(err => {
        console.error('Cannot retrieve timesheets', err);
        this.lockoutService.lockout();
      });
  }
}

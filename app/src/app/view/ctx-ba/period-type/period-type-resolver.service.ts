import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { LockoutService } from '../../../commons/service/lockout.service';
import { PeriodTypeService } from 'app/api/service/period-type.service';
import { PeriodType } from '../../../api/model/period-type';
/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class PeriodTypeResolver implements Resolve<void | PeriodType[]> {

  constructor(
    private readonly periodTypeService: PeriodTypeService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | PeriodType[]> {
    console.log('resolve PeriodType');
    const periodTypeService$ = this.periodTypeService.periodTypes();
    return lastValueFrom(periodTypeService$).then(periodTypes => { return periodTypes; })
      .catch(err => { // TODO devo fare il lockout?
        console.error('Cannot retrieve periodType', err);
        this.lockoutService.lockout(); // TODO cos'e?
      });
  }
}

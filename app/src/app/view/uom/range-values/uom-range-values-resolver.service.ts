import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LockoutService } from '../../../commons/lockout.service';

import { UomService } from '../../../api/uom.service';
import { UomRangeValues } from './uom-range-values';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class UomRangeValuesResolver implements Resolve<void | UomRangeValues[]> {

  constructor(
    private readonly uomService: UomService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | UomRangeValues[]> {
    console.log('resolve uomRangeValues');
    return this.uomService
      .uomRangeValues('')
      .toPromise()
      .then(uomRangeValues => { return uomRangeValues; })
      .catch(err => { 
        console.error('Cannot retrieve uomRangeValues', err);
        this.lockoutService.lockout();
      });
  }
}

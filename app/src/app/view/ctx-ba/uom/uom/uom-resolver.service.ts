import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';


import { LockoutService } from '../../../../commons/service/lockout.service';
import { UomService } from '../../../../api/service/uom.service';
import { Uom } from './uom';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class UomResolver implements Resolve<void | Uom[]> {

  constructor(
    private readonly uomService: UomService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | Uom[]> {
    console.log('resolve uom');

    const uomService$ = this.uomService.uoms();
    return lastValueFrom(uomService$).then(uoms => { return uoms; })
    .catch(err => { // TODO serve il lockout?
      console.error('Cannot retrieve uom', err);
      this.lockoutService.lockout();
    });
  }
}

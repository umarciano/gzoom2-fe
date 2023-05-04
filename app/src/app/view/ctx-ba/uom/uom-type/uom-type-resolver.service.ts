import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';


import { LockoutService } from '../../../../commons/service/lockout.service';
import { UomService } from '../../../../api/service/uom.service';
import { UomType } from './uom_type';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class UomTypeResolver implements Resolve<void | UomType[]> {

  constructor(
    private readonly uomService: UomService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | UomType[]> {
    console.log('resolve uomType');
    const uomService$ = this.uomService.uomTypes();
    return lastValueFrom(uomService$).then(uomTypes => { return uomTypes; })
    .catch(err => { // TODO devo fare il lockout?
      console.error('Cannot retrieve uomType', err);
      this.lockoutService.lockout(); // TODO cos'e?
    });
  }
}

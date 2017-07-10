import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { LockoutService } from '../../../commons/lockout.service';
import { UomService } from '../../../api/uom.service';
import { Uom } from './uom';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class UomResolver implements Resolve<Uom[]> {

  constructor(
    private readonly uomService: UomService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Uom[]> {
    console.log('resolve uom');

    return this.uomService
      .uoms()
      .toPromise()
      .then(uoms => { return uoms; })
      .catch(err => { // TODO devo fare il lockout?
        console.error('Cannot retrieve uom', err);
        this.lockoutService.lockout();
      });
  }
}

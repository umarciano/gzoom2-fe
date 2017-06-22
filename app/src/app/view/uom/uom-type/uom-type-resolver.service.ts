import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { LockoutService } from '../../../commons/lockout.service';
import { UomService } from '../../../api/uom.service';
import { UomType } from './uom_type';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class UomTypeResolver implements Resolve<UomType[]> {

  constructor(
    private readonly uomService: UomService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<UomType[]> {

    return this.uomService
      .uomType()
      .toPromise()
      .then(uomTypes => { return uomTypes; })
      .catch(err => { // TODO devo fare il lockout?
        console.error('Cannot retrieve uomType', err);
        this.lockoutService.lockout();
      });
  }
}

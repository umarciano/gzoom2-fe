import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';


import { LockoutService } from '../../../commons/service/lockout.service';
// import { UomService } from '../../../api/uom.service';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class InterfacciamentoDatiResolver implements Resolve<void> {

  constructor(
    // private readonly uomService: UomService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void> {

    return 
//     return this.uomService
//       .uoms()
//       .toPromise()
//       .then(uoms => { return uoms; })
//       .catch(err => { // TODO serve il lockout?
//         console.error('Cannot retrieve uom', err);
//         this.lockoutService.lockout();
//       });
  }
}

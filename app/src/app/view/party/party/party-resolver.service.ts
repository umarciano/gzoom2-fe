import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';


import { LockoutService } from '../../../commons/lockout.service';
import { PartyService } from '../../../api/party.service';
import { Party } from './party';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class PartyResolver implements Resolve<void | Party[]> {

  constructor(
    private readonly partyService: PartyService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | Party[]> {
    console.log('resolve partys');
    var parentTypeId = 'CTX_PR'; //TODO
    console.log('resolve orgUnits parentTypeId='+parentTypeId);
    return this.partyService
      .partys(parentTypeId)
      .toPromise()
      .then(partys => { return partys; })
      .catch(err => { // TODO devo fare il lockout?
        console.error('Cannot retrieve party', err);
        this.lockoutService.lockout(); // TODO cos'e?
      });
  }
}

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { LockoutService } from '../../../commons/lockout.service';
import { PartyService } from '../../../api/party.service';
import { Party } from './party';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class PartyResolver implements Resolve<Party[]> {

  constructor(
    private readonly partyService: PartyService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Party[]> {
    console.log('resolve uomType');
    return this.partyService
      .partys()
      .toPromise()
      .then(partys => { return partys; })
      .catch(err => { // TODO devo fare il lockout?
        console.error('Cannot retrieve party', err);
        this.lockoutService.lockout(); // TODO cos'e?
      });
  }
}

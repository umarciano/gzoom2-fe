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
export class OrgUnitResolver implements Resolve<void | Party[]> {

  constructor(
    private readonly partyService: PartyService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | Party[]> {
    console.log('resolve orgUnits');
    return this.partyService
      .orgUnits()
      .toPromise()
      .then(orgUnits => { return orgUnits; })
      .catch(err => { 
        console.error('Cannot retrieve party', err);
        this.lockoutService.lockout();
      });
  }
}

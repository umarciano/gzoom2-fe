import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { LockoutService } from '../../../commons/lockout.service';
import { PartyPeriodService } from '../../../api/party-period.service';
import { PartyPeriod } from './party_period';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class PartyPeriodResolver implements Resolve<PartyPeriod[]> {

  constructor(
    private readonly partyPeriod: PartyPeriodService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<PartyPeriod[]> {
    console.log('resolve partyPeriod');
    return this.partyPeriod
      .partyPeriods()
      .toPromise()
      .then(partyPeriods => { return partyPeriods; })
      .catch(err => { // TODO devo fare il lockout?
        console.error('Cannot retrieve partyPeriod', err);
        this.lockoutService.lockout(); // TODO cos'e?
      });
  }
}

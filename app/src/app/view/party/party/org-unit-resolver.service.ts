import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';


import { LockoutService } from '../../../commons/service/lockout.service';
import { PartyService } from '../../../api/service/party.service';
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
    const parentTypeId = route.parent.params.context;
    console.log('resolve orgUnits parentTypeId=' + parentTypeId);

    const partyService$ = this.partyService.orgUnits(parentTypeId, null, null, 'Company');
    return lastValueFrom(partyService$).then(orgUnits => { return orgUnits; })
    .catch(err => {
      console.error('Cannot retrieve party', err);
      this.lockoutService.lockout();
    });

    // return this.partyService
    //   .orgUnits(parentTypeId, null, null, 'Company')
    //   .toPromise()
    //   .then(orgUnits => { return orgUnits; })
    //   .catch(err => {
    //     console.error('Cannot retrieve party', err);
    //     this.lockoutService.lockout();
    //   });
  }
}

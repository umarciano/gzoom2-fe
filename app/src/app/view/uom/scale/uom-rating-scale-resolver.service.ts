import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { LockoutService } from '../../../commons/lockout.service';
import { UomService } from '../../../api/uom.service';
import { UomRatingScale } from './uom_rating_scale';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class UomRatingScaleResolver implements Resolve<void | UomRatingScale[]> {

  constructor(
    private readonly uomService: UomService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | UomRatingScale[]> {
    var id = route.paramMap.get('id');
    console.log('resolve uomRatingScale ' + id);
    return this.uomService
      .uomRatingScales(id)
      .toPromise()
      .then(uomRatingScales => { return uomRatingScales; })
      .catch(err => { // TODO serve il lockout?
        console.error('Cannot retrieve uomRatingScales ', err);
        this.lockoutService.lockout();
      });
  }
}

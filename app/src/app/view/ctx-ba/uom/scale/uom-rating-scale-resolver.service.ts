import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';


import { LockoutService } from '../../../../commons/service/lockout.service';
import { UomService } from '../../../../api/service/uom.service';
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
    var id = route.paramMap.get('uomId');
    console.log('resolve uomRatingScale ' + id);

    const uomService$ = this.uomService.uomRatingScales(id)
    return lastValueFrom(uomService$).then(uomRatingScales => { return uomRatingScales; })
    .catch(err => { 
      console.error('Cannot retrieve uomRatingScales ', err);
      this.lockoutService.lockout();
    });

    // return this.uomService
    //   .uomRatingScales(id)
    //   .toPromise()
    //   .then(uomRatingScales => { return uomRatingScales; })
    //   .catch(err => { // TODO serve il lockout?
    //     console.error('Cannot retrieve uomRatingScales ', err);
    //     this.lockoutService.lockout();
    //   });
  }
}

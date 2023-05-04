import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';


import { LockoutService } from '../commons/service/lockout.service';
import { UserPreferenceService } from '../api/service/user-preference.service';

import { UserPreference } from './user-preference';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class VisualThemeNAResolver implements Resolve<void | UserPreference> {

  constructor(
    private readonly userPreferenceService: UserPreferenceService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | UserPreference> {

    const userPreferenceService$ = this.userPreferenceService.getUserPreferenceNA('VISUAL_THEME');
    return lastValueFrom(userPreferenceService$).then(userPreference => { return userPreference; })
    .catch(err => {
      console.error('Cannot retrieve userPreference', err);
      //this.lockoutService.lockout(); cancella tutta la sessione e ti rimanda all'homepage
    });

    // return this.userPreferenceService
    //   .getUserPreferenceNA('VISUAL_THEME')
    //   .toPromise()
    //   .then(userPreference => { return userPreference; })
    //   .catch(err => {
    //     console.error('Cannot retrieve userPreference', err);
    //     //this.lockoutService.lockout(); cancella tutta la sessione e ti rimanda all'homepage
    //   });
  }
}

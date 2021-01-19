import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../commons/auth.service';
import { LockoutService } from '../commons/lockout.service';
import { I18NService } from 'app/i18n/i18n.service';

/**
 * Retrieves the localization to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class LocalizationResolver implements Resolve<void> {


  constructor(
    private readonly i18Service: I18NService,
    private readonly lockoutService: LockoutService,
    private readonly authService: AuthService
    ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void> {
      const usr = this.authService.userProfile();
      return this.i18Service.changeLang(usr.username)
      .then( data => console.log('localization resolved'))
      .catch(err => console.log('cannot resolve localization',err));
  }
}

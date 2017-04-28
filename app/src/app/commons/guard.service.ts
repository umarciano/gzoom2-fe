import { Injectable, Optional } from '@angular/core';
import {
  Router,
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from '../commons/auth.service';
import { LockoutService } from '../commons/lockout.service';

/**
 * Authentication guard.
 */
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private readonly authService: AuthService,
    private readonly lockout: LockoutService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.exit(state.url);
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  exit(url?: string) {
    this.lockout.lockout(url);
  }
}

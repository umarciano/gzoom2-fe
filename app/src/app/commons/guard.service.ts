import { Injectable, Optional } from '@angular/core';
import {
  Router,
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../commons/auth.service';

const LOGIN_ROUTE = '/login';

/**
 * Configuration class for authentication guard.
 */
export class AuthGuardConfig {
  loginRoute?: string;
}

/**
 * Authentication guard.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private loginRoute = LOGIN_ROUTE;

  constructor(
    @Optional() config: AuthGuardConfig,
    private router: Router,
    private authService: AuthService) {
    if (config) {
      if (config.loginRoute) {
        this.loginRoute = config.loginRoute;
      }
    }
  }

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
    const extras = url ? { queryParams: { returnUrl: url } } : undefined;
    this.authService.lockout();
    this.router.navigate([this.loginRoute], extras);
  }
}

import { Injectable, Optional } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../commons/auth.service';

const LOGIN_ROUTE = '/login';

/**
 * Configuration class for authentication guard.
 */
export class AuthGuardConfig {
  loginRoute = LOGIN_ROUTE;
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
    private auth: AuthService) {
    if (config) {
      if (config.loginRoute) {
        this.loginRoute = config.loginRoute;
      }
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.isLoggedIn()) {
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.auth.lockout();
    this.router.navigate([this.loginRoute], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

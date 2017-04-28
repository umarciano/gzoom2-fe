import { Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

const LOGIN_ROUTE = '/login';

/**
 * Configuration class for lockout service.
 */
export class LockoutConfig {
  loginRoute?: string;
}

/**
 * A service that performs the lockout operation.
 */
@Injectable()
export class LockoutService {
  private loginRoute: string = LOGIN_ROUTE;

  constructor(
    private router: Router,
    private authService: AuthService,
    @Optional() config: LockoutConfig) {
    if (config &&  config.loginRoute) {
        this.loginRoute = config.loginRoute;
    }
  }

  /**
   * Locks the user out of the application. Does not automatically perform a logout, no
   * backend is invoked with this method.
   *
   * @param  {string} url Optional url to redirect user to after a successful login
   */
  lockout(url?: string) {
    const extras = url ? { queryParams: { returnUrl: url } } : undefined;
    this.authService.lockout();
    this.router.navigate([this.loginRoute], extras);
  }

}

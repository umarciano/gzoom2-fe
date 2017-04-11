import { Injectable, Optional } from '@angular/core';

declare function jwt_decode(token: string): any;

const TOKEN_KEY = 'auth-token';
const PERMS_GET = function(userProfile) { return userProfile ? userProfile.permissions : 0; };

/**
 * Configuration class for authentication service.
 */
export class AuthServiceConfig {
  tokenKey?: string;
  permissionsGetter?: (any) => number;
}

/**
 * The authentication service.
 */
@Injectable()
export class AuthService {
  private tokenKey = TOKEN_KEY;
  private permissionsGetter = PERMS_GET;

  constructor( @Optional() private config: AuthServiceConfig) {
    if (config) {
      if (config.tokenKey) {
        this.tokenKey = config.tokenKey;
      }
      if (config.permissionsGetter) {
        this.permissionsGetter = config.permissionsGetter;
      }
    }
  }

  /**
   * Retrieves the current token or null if none was stored.
   *
   * @return {string} The authentication token
   */
  token(): string {
    let token = sessionStorage.getItem(this.tokenKey);
    if (!token) {
      token = localStorage.getItem(this.tokenKey);
    }
    return token;
  }

  /**
   * Tells whether user is currently logged in.
   *
   * @return {boolean} True if user is logged in, false otherwise.
   */
  isLoggedIn(): boolean {
    return !!this.token();
  }

  /**
   * Removes any trace of tokens.
   */
  lockout() {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
  }

  /**
   * Saves a new token.
   *
   * @param token {String}      The token
   * @param remember {Boolean}  If passed and it's true, token is saved in the local storage.
   */
  save(token, remember) {
    if (remember) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      sessionStorage.setItem(this.tokenKey, token);
    }
  }

  /**
   * Retrieves the user profile contained in the current authentication token.
   *
   * @return {Object} The user profile contained in the authentication token or null if no token is present.
   */
  userProfile(): any {
    const token = this.token(),
      profile = token ? jwt_decode(token) : null;
    return profile;
  }

  /**
   * Tests whether the user has a certain permission (one or multiple).
   *
   * @param permMask {int} The integer mask of the permission(s).
   */
  hasPermission(permMask) {
    const profile = this.userProfile(),
      permissions = profile ? this.permissionsGetter(profile) : 0; // no profile, no party
    return permissions & permMask;
  }
}

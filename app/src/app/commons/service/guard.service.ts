import { Injectable, Optional } from '@angular/core';
import {
  Router,
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { LockoutService } from './lockout.service';

export type LoginMethod = "GzoomNativeLogin" | "OneLogin";

declare function jwt_decode(token: string): any;
const TOKEN_KEY = 'auth-token';
const HTTP_HEADERS = new HttpHeaders();
/**
 * Authentication guard.
 */
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private readonly authService: AuthService,
    private readonly lockout: LockoutService,
    private http: HttpClient
    ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return true;
    }
    else
    {
      console.log('token NON trovato!');
    }

  this.http.get('/rest/api/getLoginMethod').subscribe(
    (data: any) => {
        console.log('login method : ' + data);
        if(data == 'OneLogin')
        {
          this.http.get('/rest/api/getOneLogin-LoginUrl').subscribe(
            (url: any) => {
                console.log('OneLogin-LoginUrl : ' + url);
                window.location.href = url;
              },
            err => console.log(err) // error
            );
        }
        else
        {
          if (this.authService.isLoggedIn()) {
            return true;
          }
          // not logged in so redirect to login page with the return url
        this.exit(state.url);
        return false;
        }
      },
    err => console.log(err) // error
    );
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  exit(url?: string) {
    this.lockout.lockout(url);
  }
}

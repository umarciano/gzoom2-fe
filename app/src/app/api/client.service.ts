
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Response } from '@angular/http';


import { ApiConfig } from './api-config';
import { behead, untail } from '../commons/commons';
import { AuthService } from '../commons/auth.service';
import { LockoutService } from '../commons/lockout.service';

import 'rxjs/add/operator/catch';

/**
 * A client that performs athenticated requests and exchanges JSON data.
 */
@Injectable()
export class ApiClientService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private lockout: LockoutService,
    private apiConfig: ApiConfig) { }

  /**
   * Performs an HTTP GET call.
   *
   * @param  {string}             path    The path relative to ApiConfig.rootPath
   * @param  {RequestOptionsArgs} options Additional options
   * @return {Observable<any>}            An Observable of the outcome
   */
  get(path: string): Observable<any> {
    const url = this.makeUrl(path);
    const opts = this.makeOptions();

    return this.http
      .get(url, opts)
      .pipe(
        catchError(this.onAuthError(this)) // then handle the error
      );
  }

  /**
   * Performs an HTTP POST call.
   *
   * @param  {string}             path    The path relative to ApiConfig.rootPath
   * @param  {any}                body    Any value that will be converted to a JSON string and
   *                                      sent as the HTTP message body. Optional, if nothing is
   *                                      specified then no body is sent at all.
   * @return {Observable<any>}            An Observable of the outcome
   */
  post(path: string, body?: any): Observable<any> {
    const url = this.makeUrl(path);
    const opts = this.makeOptions(true);
    const msg = body ? (typeof body === 'string') ? body : JSON.stringify(body) : undefined;
    // TODO opts
    return this.http
      .post(url, msg, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      })
      .pipe(catchError(this.onAuthError(this)));
  }

  put(path: string, body?: any): Observable<any> {
    const url = this.makeUrl(path);
    const opts = this.makeOptions(true);
    const msg = body ? (typeof body === 'string') ? body : JSON.stringify(body) : undefined;
    // TODO opts
    return this.http
      .put(url, msg, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      })
      .pipe(catchError(this.onAuthError(this)));
  }

  delete(path: string): Observable<any> {
    const url = this.makeUrl(path);
    const opts = this.makeOptions(true);
    // TODO opts
    return this.http
      .delete(url, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      })
      .pipe(catchError(this.onAuthError(this)));
  }

  /**
 * 
 * @param path of rest service
 * @returns complete rest url
 */
makeUrl(path: string): string {
  const rootUrl = untail(this.apiConfig.rootPath, '/');
  const relUrl = behead(path, '/');
  return rootUrl + '/' + relUrl;
}

  private makeOptions(hasBody = false): any {
    let headers = new HttpHeaders();
    if (hasBody) {
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  /**
   * Sets the JSON content type.
   *
   * @param  {HttpHeaders} headers The headers
   */
  private addJsonHeader(headers: HttpHeaders) {
    headers.set('Content-Type', 'application/json');
    // headers.set('Accept', 'application/json');
  }

  /**
   * Manages the authentication issues due to an attempt to call a remote service
   * from an unauthorized (not logged in) user.
   *
   * @param  {ApiClientService} self This service
   * @return {(err: any, caught: Observable<T>) => ObservableInput<R>}
   */
  private onAuthError(self: ApiClientService) {
    return (res: Response) => {
      // 401: unauthorized (read not authenticated)
      // 403: forbidden (read not authorized to do that operation)
      if (res.status === 401) {
        // if not authenticated
        console.error(`Unauthorized request to ${res.url}, locking user out!`);
        self.lockout.lockout();
      }
      return observableThrowError(res);
    };
  }
}

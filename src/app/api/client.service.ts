import { Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import {
  Http,
  Headers,
  RequestOptionsArgs,
  RequestOptions,
  Response
} from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { ApiConfig } from './api-config';
import { behead, untail } from '../commons/commons';
import { AuthService } from '../commons/auth.service';
import { AuthGuard } from '../commons/guard.service';

/**
 * A client that performs athenticated requests and exchanges JSON data.
 */
@Injectable()
export class ApiClientService {

  constructor(
    private http: Http,
    private router: Router,
    private authService: AuthService,
    private authGuard: AuthGuard,
    private apiConfig: ApiConfig) { }

  /**
   * Performs an HTTP GET call.
   *
   * @param  {string}             path    The path relative to ApiConfig.rootPath
   * @param  {RequestOptionsArgs} options Additional options
   * @return {Observable<any>}            An Observable of the outcome
   */
  get(path: string, options?: RequestOptionsArgs): Observable<any> {
    const url = this.makeUrl(path);
    const opts = this.makeOptions(options);

    return this.http
      .get(url, opts)
      .map(res => res.json())
      .catch(this.onAuthError(this));
  }

  /**
   * Performs an HTTP POST call.
   *
   * @param  {string}             path    The path relative to ApiConfig.rootPath
   * @param  {any}                body    Any value that will be converted to a JSON string and
   *                                      sent as the HTTP message body.
   * @param  {RequestOptionsArgs} options Additional options
   * @return {Observable<any>}            An Observable of the outcome
   */
  post(path: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    const url = this.makeUrl(path);
    const opts = this.makeOptions(options, true);
    const msg = (typeof body === 'string') ? body : JSON.stringify(body);

    return this.http
      .post(url, msg, opts)
      .map(res => res.json())
      .catch(this.onAuthError(this));
  }

  // TODO put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> { }
  // TODO delete(url: string, options?: RequestOptionsArgs): Observable<Response> { }

  private makeOptions(options?: RequestOptionsArgs, hasBody = false): RequestOptions {
    const opts = new RequestOptions(options || {});
    opts.headers = opts.headers || new Headers();
    this.addAuthHeader(opts.headers);
    if (hasBody) {
      this.addJsonHeader(opts.headers);
    }
    return opts;
  }

  private makeUrl(path: string): string {
    const rootUrl = untail(this.apiConfig.rootPath, '/');
    const relUrl = behead(path, '/');
    return rootUrl + '/' + relUrl;
  }

  /**
   * Sets the authentication token
   *
   * @param  {Headers} headers The headers
   */
  private addAuthHeader(headers: Headers) {
    headers.set('Authorization', 'Bearer ' + this.authService.token());
  }

  /**
   * Sets the JSON content type.
   *
   * @param  {Headers} headers The headers
   */
  private addJsonHeader(headers: Headers) {
    headers.set('Content-Type', 'application/json');
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
        console.log(`Unauthorized request to ${res.url}, locking user out!`);
        self.authGuard.exit();
      }
      return Observable.throw(res);
    };
  }
}

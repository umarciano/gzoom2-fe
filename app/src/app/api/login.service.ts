import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { ApiConfig } from './api-config';

import 'rxjs/add/operator/toPromise';

const LOGIN_ENDPOINT = 'login';
const HTTP_HEADERS = new Headers({ 'Content-Type': 'application/json' });

@Injectable()
export class LoginService {
  private readonly loginUrl: string;

  constructor(private http: Http, private apiConfig: ApiConfig) {
    this.loginUrl = `${apiConfig.rootPath}/${LOGIN_ENDPOINT}`;
  }

  /**
   * Logs user in.
   *
   * @param  {string}          username The user account
   * @param  {string}          password The user password
   * @return {Promise<string>}          A promise with the JWT
   */
  login(username: string, password: string): Promise<string> {
    const body = JSON.stringify({ username: username, password: password });
    const opts = { headers: HTTP_HEADERS };

    return this.http
      .post(this.loginUrl, body, opts)
      .toPromise()
      .then(response => {
        const token = response.json().token;
        if (token) {
          return token;
        }
        console.error('No token returned from authentication :-(');
        return Promise.reject('No token :-(');
      })
      .catch((error: any) => {
        console.error(`Error while logging in: ${error}`);
        return Promise.reject(error.message || error);
      });
  }

}

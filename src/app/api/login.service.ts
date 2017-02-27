import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { HTTP_HEADERS, ApiConfig } from './api-config';

import 'rxjs/add/operator/toPromise';

const LOGIN_ENDPOINT = 'login';
const LOGOUT_ENDPOINT = 'logout';

@Injectable()
export class LoginService {
  private readonly loginUrl: string;
  private readonly logoutUrl: string;

  constructor(private http: Http, private apiConfig: ApiConfig) {
    this.loginUrl = `${apiConfig.rootPath}/${LOGIN_ENDPOINT}`;
    this.logoutUrl = `${apiConfig.rootPath}/${LOGOUT_ENDPOINT}`;
  }

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
        console.log('No token returned from authentication :-(');
        return Promise.reject('No token :-(');
      })
      .catch((error: any) => {
        console.log(`Error while logging in: ${error}`);
        return Promise.reject(error.message || error);
      });
  }

}

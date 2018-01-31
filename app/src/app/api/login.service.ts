import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ApiConfig } from './api-config';

import 'rxjs/add/operator/toPromise';

const LOGIN_ENDPOINT = 'login';
const HTTP_HEADERS = new HttpHeaders();

@Injectable()
export class LoginService {
  private readonly loginUrl: string;

  constructor(private http: HttpClient, private apiConfig: ApiConfig) {
    this.loginUrl = `${apiConfig.rootPath}/${LOGIN_ENDPOINT}`;
  }

  /**
   * Logs user in.
   *
   * @param  {string}          username The user account
   * @param  {string}          password The user password
   * @return {Promise<string>}          A promise with the JWT
   */
  login(username: string, password: string): void {
    const body = JSON.stringify({ username: username, password: password });
   // TODO opts
    this.http
      .post(this.loginUrl, body, {
        headers: HTTP_HEADERS.set('Content-Type', 'application/json'),
      }).subscribe(
        (data: any) => {
            //this.userStatus = data;
        },
        err => console.log(err), // error
        () => console.log('login Complete') // complete
    );
      /*.toPromise()
      .then(response => {
        const token = response.get('token');
        if (token) {
          return token;
        }
        console.error('No token returned from authentication :-(');
        return Promise.reject('No token :-(');
      })
      .catch((error: any) => {
        console.error(`Error while logging in: ${error}`);
        return Promise.reject(error.message || error);
      });*/
  }

}

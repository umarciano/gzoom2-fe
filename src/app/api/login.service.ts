import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

const HTTP_HEADERS = new Headers({'Content-Type': 'application/json'});
const LOGIN_ENDPOINT = 'login';
const LOGOUT_ENDPOINT = 'logout';

@Injectable()
export class LoginService {

  constructor(private http: Http) { }

  login(username: string, password: string) : Promise<string> {
    let url = `../rest/${LOGIN_ENDPOINT}`;
    return this.http
      .post(url, JSON.stringify({username: username, password: password}), {headers: HTTP_HEADERS})
      .toPromise()
      .then(response => {
        const token = response.json().token;
        if (token) {
          return token;
        }
        console.log('No token returned from authentication :-(');
        return Promise.reject('No token :-(');
      })
      .catch((error:any) => {
        console.log(`Error while logging in: ${error}`);
        return Promise.reject(error.message || error);
      });
  }

}

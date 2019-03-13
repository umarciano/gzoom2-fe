import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiConfig } from './api-config';
import { ApiClientService } from './client.service';



const LOGIN_ENDPOINT = 'login';
const CHANGE_PASS_ENDPOINT = 'change-password';
const HTTP_HEADERS = new HttpHeaders();

@Injectable()
export class LoginService {
  private readonly loginUrl: string;
  private readonly changePassUrl: string;

  constructor(private http: HttpClient, private apiConfig: ApiConfig, private client: ApiClientService) {
    this.loginUrl = `${apiConfig.rootPath}/${LOGIN_ENDPOINT}`;
    this.changePassUrl = `${apiConfig.rootPath}/${CHANGE_PASS_ENDPOINT}`;
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


  changePassword(username: string, password: String, newPassword: String): void {
    const body = JSON.stringify({ username: username, password: password, newPassword: newPassword });
    this.http
      .post(this.changePassUrl, body, {
        headers: HTTP_HEADERS.set('Content-Type', 'application/json'),
      }).subscribe(
        (data: any) => {
            //this.userStatus = data;
        },
        err => console.log(err), // error
        () => console.log('change password Complete') // complete
    );
  }

 
  /*
  changePassword(username: string, password: String, newPassword: String) {
    console.log('changePassword2 ');    
    const body = JSON.stringify({ username: username, password: password, newPassord: newPassword });
    return this.client
    .post(this.changePassUrl, body)
    .toPromise()
    .then(response => response)
    .catch(response => {
      console.error(`Error while creating in: ${response}`);
      return Promise.reject(response.json() || response);
    });
  }*/

  updateUserPreference(userPreference: UserPreference):  Promise<UserPreference> {
    console.log('update Timesheet');
    return this.client
      .put(`user-preference/`, userPreference)
      .toPromise()
      .then(response => response)
      .catch((response: any) => {
        console.error(`Error while updating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }
  
}

/**
 * UserPreference
 */
export class UserPreference {
  constructor(
    public userLoginId?: string, 
    public userPrefTypeId?: string, 
    public userPrefValue?:  string) {};
}
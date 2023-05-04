import { lastValueFrom, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserLogin } from '../user-login';
import { ApiClientService } from '../../commons/service/client.service';

@Injectable()
export class ChangePasswordService {
  private popupSubject = new Subject<any>();
  popupObservable = this.popupSubject.asObservable();
  
  constructor(private client: ApiClientService) { }

  openPopup(user: UserLogin) {
    this.popupSubject.next(user);
  }

  changePassword(username: String, password: String, newPassword: String):  Promise<UserLogin> {
    const body = JSON.stringify({ username: username, password: password, newPassword: newPassword });

    const client$ = this.client.post('change-password', body);
    return lastValueFrom(client$).then(response => response)
    .catch(async (error) => {
      return Promise.reject(await error.error.message);
    });

    // return this.client
    //   .post('change-password', body)
    //   .toPromise()
    //   .then(response => response)
    //   .catch(async (error) => {
    //     return Promise.reject(await error.error.message);
    //   });
    }
}

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from './client.service';

import { UserPreference } from '../shared/user-preference';


@Injectable()
export class UserPreferenceService {


  constructor(private client: ApiClientService) {}

  updateUserPreference(userPreference: UserPreference):  Promise<UserPreference> {
    console.log('update userPreference');
    return this.client
      .put(`user-preference/`, userPreference)
      .toPromise()
      .then(response => response)
      .catch((response: any) => {
        console.error(`Error while updating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  getUserPreferenceNA(userPrefTypeId: String):  Observable<UserPreference> {
    console.log('get userPreference _NA_ userPrefTypeId' + userPrefTypeId);
      return this.client
      .get(`user-preference-na/` + userPrefTypeId).pipe(
        map(json => json as UserPreference)
      );
    }

    getUserPreference(userPrefTypeId: String):  Observable<UserPreference> {
      console.log('get userPreference userPrefTypeId' + userPrefTypeId);
      return this.client
      .get(`user-preference/` + userPrefTypeId).pipe(
        map(json => json as UserPreference)
      );
  }
  
}

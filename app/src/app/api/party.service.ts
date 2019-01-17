import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http'


import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { ApiClientService } from './client.service';

import { Party } from '../view/party/party/party';

@Injectable()
export class PartyService {

  constructor(private client: ApiClientService) { }

  partys(): Observable<Party[]> {
    console.log('search party');
    return this.client
      .get('party').pipe(
        map(json => json.results as Party[])
      );
  }

  orgUnits(): Observable<Party[]> {
    console.log('search orgUnits');
    return this.client
      .get('orgUnits').pipe(
        map(json => json.results as Party[])
      );
  }

  roleTypePartys(roleTypeId: string): Observable<Party[]> {
    console.log('search party whit roleTypeId='+roleTypeId);
    return this.client
      .get(`party/roleType/${roleTypeId}`).pipe(
        map(json => json.results as Party[])
      );
  }


}

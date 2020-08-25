import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http'


import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from './client.service';

import { Party } from '../view/party/party/party';
import { ReportParam } from 'app/view/report-print/report';
import { operators } from 'rxjs/Rx';

@Injectable()
export class PartyService {

  constructor(private client: ApiClientService) { }

  partys(parentTypeId: string): Observable<Party[]> {
    console.log('search party');
    return this.client
      .get(`party/${parentTypeId}`).pipe(
        map(json => json.results as Party[])
      );
  }

  orgUnits(parentTypeId: string, options: string): Observable<Party[]> {
    console.log('search orgUnits');
    let optionsURL = '';
    if (options) {
      optionsURL = '?roleTypeId=' + options;
    }
    return this.client
      .get(`orgUnits/${parentTypeId}` + optionsURL).pipe(
        map(json => json.results as Party[])
      );
  }

  roleTypePartys(roleTypeId: string, options: string): Observable<Party[]> {
    console.log('search party whit roleTypeId='+roleTypeId);
    let optionsURL = '';
    if (options) {
      optionsURL = '?roleTypeIdFrom=' + options;
    }
    return this.client
      .get(`party/roleType/${roleTypeId}` + optionsURL).pipe(
        map(json => json.results as Party[])
      );
  }

  roleTypePartysBetween(roleTypeId: string): Observable<Party[]> {
    console.log('search party whit roleTypeId='+roleTypeId);
    return this.client
      .get(`party/roleType/between/${roleTypeId}`).pipe(
        map(json => json.results as Party[])
      );
  }

  roleTypePartysIn(roleTypeId: string): Observable<Party[]> {
    console.log('search party whit roleTypeId='+roleTypeId);
    return this.client
      .get(`party/roleType/in/${roleTypeId}`).pipe(
        map(json => json.results as Party[])
      );
  }

  roleTypePartysNotIn(roleTypeId: string): Observable<Party[]> {
    console.log('search party whit roleTypeId='+roleTypeId);
    return this.client
      .get(`party/roleType/notin/${roleTypeId}`).pipe(
        map(json => json.results as Party[])
      );
  }


}

import { Injectable } from '@angular/core';


import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from '../../commons/service/client.service';

import { Party } from '../../view/party/party/party';

@Injectable()
export class PartyService {

  constructor(private client: ApiClientService) { }

  partys(parentTypeId: string): Observable<Party[]> {
    return this.client
      .get(`party/${parentTypeId}`).pipe(
        map(json => json.results as Party[])
      );
  }

  orgUnits(parentTypeId: string, options: string, workEffortTypeId: string, company: string): Observable<Party[]> {
    let optionsURL = '';
    if (options) {
      optionsURL = '?roleTypeId=' + options;
    }
    if (workEffortTypeId) {
      optionsURL += optionsURL === '' ? `?workEffortTypeId=${workEffortTypeId}` : `&workEffortTypeId=${workEffortTypeId}`;
    }
    if (company) {
      optionsURL += optionsURL === '' ? `?company=${company}` : `&company=${company}`;
    }

    return this.client
      .get(`orgUnits/${parentTypeId}` + optionsURL).pipe(
        map(json => json.results as Party[])
      );
  }

  roleTypePartys(roleTypeId: string, options: string, workEffortTypeId: string): Observable<Party[]> {
    let optionsURL = '';
    if (options) {
      optionsURL = '?roleTypeIdFrom=' + options;
    }
    if (workEffortTypeId) {
      optionsURL += optionsURL === '' ? `?workEffortTypeId=${workEffortTypeId}` : `&workEffortTypeId=${workEffortTypeId}`;
    }
    return this.client
      .get(`party/roleType/${roleTypeId}` + optionsURL).pipe(
        map(json => json.results as Party[])
      );
  }

  roleTypePartysBetween(roleTypeId: string): Observable<Party[]> {
    return this.client
      .get(`party/roleType/between/${roleTypeId}`).pipe(
        map(json => json.results as Party[])
      );
  }

  roleTypePartysIn(roleTypeId: string): Observable<Party[]> {
    return this.client
      .get(`party/roleType/in/${roleTypeId}`).pipe(
        map(json => json.results as Party[])
      );
  }

  roleTypePartysNotIn(roleTypeId: string): Observable<Party[]> {
    return this.client
      .get(`party/roleType/notin/${roleTypeId}`).pipe(
        map(json => json.results as Party[])
      );
  }


}

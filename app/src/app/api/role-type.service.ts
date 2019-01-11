import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { ApiClientService } from './client.service';

import { RoleType } from '../view/role-type/role-type/role-type';

@Injectable()
export class RoleTypeService {

  constructor(private client: ApiClientService) { }

  roleTypes(): Observable<RoleType[]> {
    console.log('search roleType with ');
    return this.client
      .get(`role-types`).pipe(
        map(json => json.results as RoleType[])
      );
  }

}

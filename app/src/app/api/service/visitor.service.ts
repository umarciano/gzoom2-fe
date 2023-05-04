import { Injectable } from '@angular/core';

import {dtoToDateTime} from '../../commons/model/utils';

import { ApiClientService } from '../../commons/service/client.service';

import { Visit } from '../../view/ctx-ba/visitor/visit/visit';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class VisitorService {

  constructor(private client: ApiClientService) { }

  visits(): Observable<Visit[]> {
    console.log('search visit');
    return this.client.get('visit').pipe(
      map(json => json.results as Visit[])
    );
  }
}

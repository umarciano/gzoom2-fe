import { Injectable } from '@angular/core';

import {dtoToDateTime} from './utils';

import { ApiClientService } from './client.service';

import { Visit } from '../view/visitor/visit/visit';

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

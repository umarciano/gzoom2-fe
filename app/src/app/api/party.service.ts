import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import { ApiClientService } from './client.service';
import { Party } from '../view/party/party/party';

@Injectable()
export class PartyService {

  constructor(private client: ApiClientService) { }

  partys(): Observable<Party[]> {
    console.log('search party');
    return this.client
      .get('party/party')
      .map(json => json.results as Party[]);
  }



}

import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import { ApiClientService } from './client.service';
import { PartyPeriod } from '../view/timesheet/party-period/party_period';

@Injectable()
export class PartyPeriodService {

  constructor(private client: ApiClientService) { }

  partyPeriods(): Observable<PartyPeriod[]> {
    console.log('search partyPeriod');
    return this.client
      .get('uom/type')
      .map(json => json.results as PartyPeriod[]);
  }


}

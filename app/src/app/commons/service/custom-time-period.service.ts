import { Injectable } from '@angular/core';
import { CustomTimePeriod } from 'app/api/model/customTimePeriod';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from './client.service';


@Injectable()
export class CustomTimePeriodService {

  constructor(private client: ApiClientService) { }

  customTimePeriods(periodTypeId: string): Observable<CustomTimePeriod[]> {
    console.log('search customTimePeriods with '+ periodTypeId);
    return this.client
      .get(`customtimeperiods/${periodTypeId}`).pipe(
        map(json => json.results as CustomTimePeriod[])
      );
  }

}

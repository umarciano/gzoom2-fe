import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import { ApiClientService } from './client.service';
import { Timesheet } from '../view/timesheet/timesheet/timesheet';
import { TimeEntry } from '../view/timesheet/time-entry/time_entry';

@Injectable()
export class TimesheetService {

  constructor(private client: ApiClientService) { }

  timesheets(): Observable<Timesheet[]> {
    console.log('search timesheet');
    return this.client
      .get('timesheet/timesheet')
      .map(json => json.results as Timesheet[]);
  }

  timeEntries(): Observable<TimeEntry[]> {
    console.log('search timeEntries');
    return this.client
      .get('timesheet/time-entries')
      .map(json => json.results as Timesheet[]);
  }


}

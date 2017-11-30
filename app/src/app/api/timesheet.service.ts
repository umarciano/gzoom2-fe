import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import { ApiClientService } from './client.service';
import { Timesheet } from '../view/timesheet/timesheet/timesheet';
import { TimeEntry } from '../view/timesheet/time-entry/time_entry';

import * as moment from 'moment';

@Injectable()
export class TimesheetService {

  constructor(private client: ApiClientService) { }

  timesheets(): Observable<Timesheet[]> {
    console.log('search timesheet');
    return this.client
      .get('timesheet/timesheet')
      .map(json => json.results as Timesheet[]);
  }

  createTimesheet(timesheet: Timesheet):  Promise<Timesheet> {
    console.log('create Timesheet');
    return this.client
      .post('timesheet/timesheet', this.saveTimesheetBodifier(timesheet))
      .toPromise()
      .then(response => response)
      .catch(response => {
        console.error(`Error while creating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  updateTimesheet(timesheetId: string, timesheet: Timesheet):  Promise<Timesheet> {
    console.log('update Timesheet');
    return this.client
      .put(`timesheet/timesheet/${timesheetId}`, this.saveTimesheetBodifier(timesheet))
      .toPromise()
      .then(response => response)
      .catch((response: any) => {
        console.error(`Error while updating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  deleteTimesheet(timesheetId: string):  Promise<Timesheet> {
    console.log('delete Timesheet with ' + timesheetId);
    return this.client
      .delete(`timesheet/timesheet/${timesheetId}`)
      .toPromise()
      .then(response => response)
      .catch((response: any) => {
        console.error(`Error while deleting in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  timeEntries(timesheetId: String): Observable<TimeEntry[]> {
    console.log('search timeEntries for timesheetId: ' + timesheetId);
    return this.client
      .get('timesheet/time-entry')
      .map(json => json.results as TimeEntry[]);
  }

  workEfforts(): Observable<TimeEntry[]> {
    console.log('search workEffort activities');
    return this.client
      .get('timesheet/time-entry-workefforts')
      .map(json => json.results as TimeEntry[]);
  }

  //Bodifier methods
  saveTimesheetBodifier(timesheet) {
      return {
        fromDate: this.getDate(timesheet.fromDate),
        thruDate: this.getDate(timesheet.thruDate),
        actualHours: (timesheet) ? timesheet.actualHours : null,
        contractHours: (timesheet) ? timesheet.contractHours : null,
        partyId: (timesheet) ? timesheet.partyId : null,
        timesheetId: (timesheet) ? timesheet.timesheetId : null
      };
    }


    getDate(date) {
      if (date) return moment(date).format("YYYY-MM-DD");
      else return null;
    }

}

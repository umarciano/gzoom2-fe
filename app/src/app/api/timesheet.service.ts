import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from './client.service';

import { Timesheet } from '../view/timesheet/timesheet/timesheet';
import { TimeEntry } from '../view/timesheet/time-entry/time_entry';
import { WorkEffort } from '../view/timesheet/time-entry/work_effort';

import * as moment from 'moment';
import * as _ from 'lodash';


@Injectable()
export class TimesheetService {

  constructor(private client: ApiClientService) { }

  timesheets(): Observable<Timesheet[]> {
    console.log('search timesheet');
    return this.client
      .get('timesheet/timesheet').pipe(
        map(json => json.results as Timesheet[])
      );
  }

  timesheet(timesheetId: string):  Observable<Timesheet> {
    console.log('search timesheet with ' + timesheetId);
    return this.client
      .get(`timesheet/timesheet/${timesheetId}`).pipe(
        map(json => json as Timesheet)
      );
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

  timeEntries(timesheetId: string): Observable<TimeEntry[]> {
    console.log('search timeEntries for timesheetId: ' + timesheetId);
    return this.client
      .get(`timesheet/time-entry/${timesheetId}`).pipe(
        map(json => json.results as TimeEntry[])
      );
  }

  workEfforts(timesheetId: string): Observable<WorkEffort[]> {
    console.log('search workEffort activities');
    return this.client
      .get(`timesheet/time-entry-work-efforts/${timesheetId}`).pipe(
        map(json => json.results as WorkEffort[])
      );
  }

  createOrUpdateTimeEntry(timeEntries: TimeEntry[]):  Promise<TimeEntry> {
    console.log('create timeEntry');
    return this.client
      .post('timesheet/time-entry-create-or-update', this.saveTimeEntriesBodifier(timeEntries))
      .toPromise()
      .then(response => response)
      .catch(response => {
        console.error(`Error while creating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  /*
  updateTimeEntry(timeEntryId: string, timeEntry: TimeEntry):  Promise<TimeEntry> {
    console.log('update timeEntry');
    return this.client
      .put(`timesheet/time-entry-update/${timeEntryId}`, this.saveTimesheetBodifier(timeEntry))
      .toPromise()
      .then(response => response)
      .catch((response: any) => {
        console.error(`Error while updating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }
  */
  
  deleteTimeEntry(timeEntryId: string):  Promise<TimeEntry> {
    console.log('delete timeEntryId with ' + timeEntryId);
    return this.client
      .delete(`timesheet/time-entry-delete/${timeEntryId}`)
      .toPromise()
      .then(response => response)
      .catch((response: any) => {
        console.error(`Error while deleting in: ${response}`);
        return Promise.reject(response.json() || response);
      });
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

    saveTimeEntriesBodifier(timeEntries: TimeEntry[]) {
      return timeEntries.map((timeEntry) => {
          return {
            workEffortId: timeEntry.workEffortId,
            timesheetId: timeEntry.timesheetId,
            percentage: timeEntry.percentage,
            timeEntryId: timeEntry.timeEntryId,
            fromDate: this.getDate(timeEntry.fromDate),
            thruDate: this.getDate(timeEntry.thruDate),
            description: timeEntry.description
          };
        });
      }

    getDate(date) {
      if (date) return moment(date).format("YYYY-MM-DD");
      else return null;
    }
    

}

class PrimeTimeEntry implements TimeEntry {
  constructor(public dirty:boolean, public timeEntryId?: string, public timesheetId?: string, 
              public workEffortId?: string, public description?: string, public percentage?: number) { }
}


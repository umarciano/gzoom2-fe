import { Injectable } from '@angular/core';

import { lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from '../../commons/service/client.service';

import { Timesheet } from '../model/timesheet';
import { TimeEntry } from '../model/time_entry';
import { WorkEffort } from '../../view/work-effort/work-effort/work-effort';

import * as moment from 'moment';
import * as _ from 'lodash';
import { ActivatedRouteSnapshot } from '@angular/router';


@Injectable()
export class TimesheetService {
  constructor(private client: ApiClientService) { }

  timesheets(context: string): Observable<Timesheet[]> {
    return this.client
      .get(`timesheet/${context}`).pipe(
        map(json => json.results as Timesheet[])
      );
  }

  params(context: string): Observable<any[]> {
    return this.client
      .get(`timesheet/params/${context}`).pipe(
        map(json => json.results as any[])
      );
  }

  isAdmin(context: string): Observable<boolean> {
    return this.client
      .get(`permission/permission/role/${context}`).pipe(
        map(json => json as boolean)
      );
  }

  deleteTimesheet(timesheet: string[]): Promise<string[]> {
    console.log('delete Timesheet with ' + timesheet);

    const client$ = this.client.delete(`timesheet/${timesheet}`);
    return lastValueFrom(client$).then(response => response)
      .catch((error: any) => {
        console.error(`Error while deleting in: ${error.error.message}`);
        return Promise.reject(error.error);
      });
  }

  createTimesheet(timesheet: Timesheet): Promise<Timesheet> {
    console.log('create Timesheet');

    const client$ = this.client.post('timesheet/timesheet', this.saveTimesheetBodifier(timesheet));
    return lastValueFrom(client$).then(response => response)
      .catch(response => {
        console.error(`Error while creating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  updateTimesheet(timesheetId: string, timesheet: Timesheet): Promise<Timesheet> {
    console.log('update Timesheet');

    const client$ = this.client.put(`timesheet/${timesheetId}`, this.saveTimesheetBodifier(timesheet));
    return lastValueFrom(client$).then(response => response)
      .catch((response: any) => {
        console.error(`Error while updating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  timeEntries(timesheetId: string): Observable<TimeEntry[]> {
    console.log('search timeEntries for timesheetId: ' + timesheetId);
    return this.client
      .get(`time-entry/time-entry/${timesheetId}`).pipe(
        map(json => json.results as TimeEntry[])
      );
  }

  timesheetTimeEntry(timesheetId: string): Observable<Timesheet[]> {
    return this.client
      .get(`time-entry/time-entry-timesheet/${timesheetId}`).pipe(
        map(json => json.results as Timesheet[])
      );
  }

  workEfforts(timesheetId: string): Observable<WorkEffort[]> {
    return this.client
      .get(`time-entry/time-entry-work-efforts/${timesheetId}`).pipe(
        map(json => json.results as WorkEffort[])
      );
  }

  updateTimeEntry(timeEntries: TimeEntry[]): Promise<TimeEntry> {
    console.log('update timeEntry');
    const client$ = this.client.put('time-entry/', this.saveTimeEntriesBodifier(timeEntries));
    return lastValueFrom(client$).then(response => response)
      .catch(response => {
        console.error(`Error while creating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }


  deleteTimeEntry(timeEntrys: string[]): Promise<TimeEntry> {
    const client$ = this.client.delete(`time-entry/${timeEntrys}`);
    return lastValueFrom(client$).then(response => response)
      .catch((error: any) => {
        console.error(`Error while deleting in: ${error.error.message}`);
        return Promise.reject(error.error);
      });
  }

  //Bodifier methods
  saveTimesheetBodifier(timesheet) {
    return {
      fromDate: new Date(timesheet.fromDate),
      thruDate: new Date(timesheet.thruDate),
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
        timeEntryId: timeEntry.variableGridArray.id,
        fromDate: new Date(timeEntry.fromDate),
        thruDate: new Date(timeEntry.thruDate),
        description: timeEntry.description,
        rateTypeId: 'STANDARD',
        hours: timeEntry.hours,
        planHours: timeEntry.planHours,
        comments: timeEntry.comments,
        partyId: timeEntry.partyId,
        effortUomId: timeEntry.effortUomId
      };
    });
  }
}

class PrimeTimeEntry implements TimeEntry {
  constructor(public dirty: boolean, public timeEntryId?: string, public timesheetId?: string,
    public workEffortId?: string, public description?: string, public percentage?: number) { }
}


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/switchMap';

import {TimeEntry} from './time_entry';
import {Timesheet} from '../timesheet/timesheet';

import { ConfirmDialogModule, ConfirmationService, SpinnerModule, TooltipModule } from 'primeng/primeng';
import { SelectItem } from '../../../commons/selectitem';
import { Message } from '../../../commons/message';
import { I18NService } from '../../../commons/i18n.service';
import { TimesheetService } from '../../../api/timesheet.service';
import { templateJitUrl } from '@angular/compiler';

import {InputTextModule} from 'primeng/primeng';

@Component({
  selector: 'app-time-entry',
  templateUrl: './time-entry.component.html',
  styleUrls: ['./time-entry.component.scss']
})
export class TimeEntryComponent implements OnInit {

  timesheets: Timesheet[];
  timeEntries: TimeEntry[];
  _reload: Subject<void>;
  displayDialog: boolean;
  error = '';
  form: FormGroup;
  msgs: Message[] = [];
  /** whether create or update */
  newTimeEntry: boolean;
  /** Timesheet to save*/
  timeEntry: TimeEntry = new PrimeTimeEntry();
  /** Selected timesheet in Dialog*/
  timesheetId: string;
  selectedTimeEntry: TimeEntry;
  selectedTimesheetId: string;
  selectedWorkEffortId: string;
  workEffortSelectItem: SelectItem[] = [];

  constructor(
    private readonly timesheetService: TimesheetService,
    private readonly confirmationService: ConfirmationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly i18nService: I18NService,
    private fb: FormBuilder) {

      this._reload = new Subject<void>();
  }

  ngOnInit() {

    this.form = this.fb.group({
      'partyId': new FormControl('', Validators.required),
      'fromDate': new FormControl('', Validators.required),
      'thruDate': new FormControl('', Validators.required),
      'contractHours': new FormControl(''),
      'actualHours': new FormControl('')
    });

    const reloadedWorkEffort = this._reload.switchMap(() => this.timesheetService.workEfforts());
    const reloadedTimesheets = this._reload.switchMap(() => this.timesheetService.timesheets());
    const reloadedTimeEntries = this._reload.switchMap(() => this.timesheetService.timeEntries(this.timesheetId));

    this.route.data
      .map((data: { timesheets: Timesheet[] }) => data.timesheets)
      .subscribe(data => this.timesheets = data);

    this.route.data
      .map((data: { timeEntries: TimeEntry[] }) => data.timeEntries)
      .merge(reloadedTimeEntries)
      .subscribe((data) => {
        this.timeEntries = data;
      });

    this.route.paramMap
      .switchMap((params) => {
        this.selectedTimesheetId = params.get('id');
        //return this.timesheetService.timeEntries(this.selectedTimesheetId);
        return this.timesheetService.timeEntries('10020');
      })
      .subscribe((data) => {
        this.timeEntries = data;
        this._reload.next();
    });

    const timesheetsObs = this.route.data
    .map((data: { timesheets: Timesheet[] }) => data.timesheets)
    .merge(reloadedTimesheets);

    timesheetsObs.subscribe((data) => {
      this.timesheets = data;
    });

    const workEffortObs = this.route.data
    .map((data: { workEfforts: TimeEntry[] }) => data.workEfforts)
    .merge(reloadedWorkEffort);


    workEffortObs
      .map(workEFforts2SelectItems)
      .subscribe((data) => {
        this.workEffortSelectItem = data;
        this.workEffortSelectItem.push({label: this.i18nService.translate('Select WorkEffort'), value:null});
      });
    }

    onRowSelect(data: Timesheet) {
      this.timesheetId = data.timesheetId;
      this.displayDialog = true;
      /*return this.timesheetService
        .timeEntries(this.timesheetId);*/
      this.router.navigate([this.timesheetId], { relativeTo: this.route });
    }
}

class PrimeTimeEntry implements TimeEntry {
  constructor(public timeEntryId?: string, public workEffortId?: string,
              public description?: string) { }
}

function workEFforts2SelectItems(workEffort: TimeEntry[]): SelectItem[] {
  return workEffort.map((t:TimeEntry) => {
    return {label: t.workEffortId, value: t.workEffortId};
  });
}

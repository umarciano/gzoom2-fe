import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { first, map, merge, switchMap } from 'rxjs/operators';

import { ConfirmDialogModule, ConfirmationService, InputTextModule, SpinnerModule, TooltipModule } from 'primeng/primeng';

import { TimeEntry } from './time_entry';
import { Timesheet } from '../timesheet/timesheet';
import { WorkEffort } from './work_effort';

import { SelectItem } from '../../../commons/selectitem';
import { Message } from '../../../commons/message';
import { I18NService } from '../../../commons/i18n.service';
import { TimesheetService } from '../../../api/timesheet.service';

import {AutoCompleteModule} from 'primeng/primeng';
import { isBlank } from 'app/commons/commons';


@Component({
  selector: 'app-time-entry-detail',
  templateUrl: './time-entry-detail.component.html',
  styleUrls: ['./time-entry.component.scss']
})
export class TimeEntryDetailComponent implements OnInit {

  timeEntries: TimeEntry[] = [];
  _reload: Subject<void>;
  error = '';
  msgs: Message[] = [];
  form: FormGroup;
  /** whether create or update */
  newTimeEntry: boolean;
  /** Timesheet to save*/
  timeEntry: TimeEntry = new PrimeTimeEntry(false);
  selectedTimeEntry: TimeEntry;
  selectedTimesheetId: string;
  selectedWorkEffortId: string;
  workEffortSelectItem: SelectItem[] = [];
  activities: SelectItem[] = [];
  filteredActivities: any[] = [];

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
    console.log(" - ngOnInit ");

    const reloadedWorkEffort = this._reload.switchMap(() => this.timesheetService.workEfforts(this.selectedTimesheetId));
    const reloadedTimeEntries = this._reload.switchMap(() => this.timesheetService.timeEntries(this.selectedTimesheetId));

    this.route.paramMap
      .switchMap((params) => {
        this.selectedTimesheetId = params.get('id');
        console.log(" - this.selectedTimesheetId " + this.selectedTimesheetId);
        return this.timesheetService.timeEntries(this.selectedTimesheetId);
      })
      .subscribe((data) => {
        console.log(" - paramMap data " + data);
      console.log(" - paramMap this.selectedTimesheetId " + this.selectedTimesheetId);
          
      if (data && data.length > 0) {
        this.timeEntries = data;
      }
    });

    this.route.data.pipe(
      map((data: { timeEntries: TimeEntry[] }) => data.timeEntries),
      merge(reloadedTimeEntries)
    ).subscribe((data) => {
      console.log(" - data " + data);
      if (data && data.length > 0) {
        this.timeEntries = data;
      }
      this.addRow();
    });

    const workEffortObs = this.route.data.pipe(
      map((data: { workEfforts: WorkEffort[] }) => data.workEfforts),
      merge(reloadedWorkEffort),
      map(workEFforts2SelectItems)
    ).subscribe((data) => {
        this.workEffortSelectItem = data;
        this.workEffortSelectItem.push({label: this.i18nService.translate('Select WorkEffort'), value:null});
      });
  }

  addRow() {
    this.newTimeEntry = true;
    let timeEntries1 = new PrimeTimeEntry(false);
    timeEntries1.timesheetId = this.selectedTimesheetId;
    
    this.timeEntries.push(timeEntries1);
  }

  saveTimeEntry() {
    console.log("save timeEntry");
    console.log(this.timeEntries);
    this.timesheetService
      .createOrUpdateTimeEntry(this.timeEntries)
      .then(() => {
        this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Created'), detail:this.i18nService.translate('Record created')}];
        this._reload.next();
      })
      .catch((error) => {
        console.log('error' , error.message);
        this.error = this.i18nService.translate(error.message) || error;
      });
  }

  confirmDeleteTimeEntry(data: TimeEntry) {
    this.confirmationService.confirm({
      message: this.i18nService.translate('Do you want to delete this record?'),
      header: this.i18nService.translate('Delete Confirmation'),
      icon: 'fa fa-trash-alt',
      accept: () => {
        this.deleteTimeEntry(data);
      },
      reject: () => {
          this.timeEntry = null;
        }
    });
  }

  deleteTimeEntry(data: TimeEntry) {
    this.timesheetService
      .deleteTimeEntry(data.timeEntryId)
      .then(data => {
        this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Confirmed'), detail:this.i18nService.translate('Record deleted')}];
        this._reload.next();
      })
      .catch((error) => {
        console.log('error' , error.message);
        this.error = this.i18nService.translate(error.message) || error;
      });
  }

  filterActivities(event) {
    console.log(" - event " + event);
    console.log(" - event.query " + event.query);
    this.filteredActivities = [];
    console.log(" - this.filteredActivities " + this.filteredActivities);
     for(let i = 0; i < this.workEffortSelectItem.length; i++) {
         let record = this.workEffortSelectItem[i];
         if(record.label.toLowerCase().indexOf(event.query.toLowerCase()) >= 0) {
          console.log(" - push " + record.label);
                     this.filteredActivities.push(record.label);
          }
     }
    console.log(" - this.filteredActivities " + this.filteredActivities);
    
  }
  onDropdownClick(event)  {
    console.log(" - onDropdownClick event " + event);
    
  }
  onSelect(valueSelected, index) {
    console.log(" - onSelect valueSelected " + valueSelected);
    this.filteredActivities = [];
    console.log(" - onSelect this.filteredActivities " + this.filteredActivities);
     for(let i = 0; i < this.workEffortSelectItem.length; i++) {
         let record = this.workEffortSelectItem[i];
         if(record.label.toLowerCase().indexOf(valueSelected.toLowerCase()) >= 0) {
            console.log(" - onSelect value " + record.value);
            this.timeEntries[index].workEffortId = record.value;
          }
     }
    
  }
}

function workEFforts2SelectItems(workEffort: WorkEffort[]): SelectItem[] {
  return workEffort.map((t:WorkEffort) => {
    return {label: t.attivitaLiv1 + " - " + t.attivitaLiv2 + " - " + t.attivitaLiv3, value: t.workEffortId};
  });
}

class PrimeTimeEntry implements TimeEntry {
  constructor(public dirty:boolean, public timeEntryId?: string, public timesheetId?: string, public workEffortId?: string,
              public description?: string, public percentage?: number) { }
}

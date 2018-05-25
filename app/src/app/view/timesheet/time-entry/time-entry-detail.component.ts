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
import { summaryForJitFileName } from '@angular/compiler/src/aot/util';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';

import { Uom } from '../../uom/uom/uom';
import { UomService } from '../../../api/uom.service';

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
  timesheet: Timesheet = new Timesheet();
  selectedTimeEntry: TimeEntry;
  selectedTimesheetId: string;
  selectedWorkEffortId: string;
  workEffortSelectItem: SelectItem[] = [];
  activities: SelectItem[] = [];
  filteredActivities: any[] = [];
  totalPercentage: number;

   /** uom per formattazione */
   formatNumber: String;
   uom: Uom;
   patternRegExp: String;

  constructor(
    private readonly timesheetService: TimesheetService,
    private readonly confirmationService: ConfirmationService,
    private readonly uomService: UomService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly i18nService: I18NService,
    private fb: FormBuilder) {

      this._reload = new Subject<void>();
  }

  ngOnInit() {
    console.log(" - ngOnInit ");

    const reloadedWorkEffort = this._reload.switchMap(() => this.timesheetService.workEfforts(this.selectedTimesheetId));
    const reloadedTimeEntries = this._reload.switchMap(() => this.timesheetService.timeEntries(this.selectedTimesheetId));
    const reloadedTimesheet = this._reload.switchMap(() => this.timesheetService.timesheet(this.selectedTimesheetId));

    this.route.paramMap
      .switchMap((params) => {
        this.selectedTimesheetId = params.get('id');
        console.log(" - this.selectedTimesheetId " + this.selectedTimesheetId);
        return this.timesheetService.timesheet(this.selectedTimesheetId);
      })
      .subscribe((data) => {
        console.log(" - paramMap data " + data);
        this.timesheet = data;
    });

    /**Carico il mio uom */
    this.route.paramMap
    .switchMap((params) => { return this.uomService.uom("OTH_100"); })
    .subscribe((data) => { 
      this.uom = data;
      this.formatNumber = this.uomService.formatNumber(data); 
      this.patternRegExp = this.uomService.patternRegExp(data);
      console.log('decimalScale'+ this.uom.decimalScale);
    });



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

      //aggiornare totale
      this.totalPercentage = 0;
      this.timeEntries.forEach(c => this.totalPercentage +=  isNumber(c.percentage) ?  +c.percentage : +0);
      console.log(" - totalPercentage " + this.totalPercentage);
      
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
    console.log("start save timeEntry");

    //aggiornare totale
    this.totalPercentage = 0;
    this.timeEntries.forEach(c => this.totalPercentage +=  isNumber(c.percentage) ?  +c.percentage : +0);
    console.log(" - totalPercentage " + this.totalPercentage);
    if (this.totalPercentage > 100) {
      this.error = this.i18nService.translate("The percentage can not be greater than 100");
      return;
    }

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
      icon: 'fa fa-question-circle',
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
    this.filteredActivities = [];
     for(let i = 0; i < this.workEffortSelectItem.length; i++) {
         let record = this.workEffortSelectItem[i];
         if(record.label.toLowerCase().indexOf(event.query.toLowerCase()) >= 0) {
                     this.filteredActivities.push(record.label);
          }
     }
    
  }
  
  onSelect(valueSelected, index) {
    this.filteredActivities = [];
     for(let i = 0; i < this.workEffortSelectItem.length; i++) {
         let record = this.workEffortSelectItem[i];
         if(record.label.toLowerCase().indexOf(valueSelected.toLowerCase()) >= 0) {
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

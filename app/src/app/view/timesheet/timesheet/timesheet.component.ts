import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { first, map, merge, switchMap } from 'rxjs/operators';

import { ConfirmDialogModule, ConfirmationService, SpinnerModule, TooltipModule } from 'primeng/primeng';

import * as moment from 'moment';

import { SelectItem } from '../../../commons/selectitem';
import { I18NService } from '../../../commons/i18n.service';
import { i18NDatePipe } from '../../../commons/i18nDate.pipe';
import { Message } from '../../../commons/message';
import { Timesheet } from './timesheet';
import { TimesheetService } from '../../../api/timesheet.service';

import { Party } from '../../party/party/party';
import { PartyService } from '../../../api/party.service';


/** Convert from Party[] to SelectItem[] */
function party2SelectItems(person: Party[]): SelectItem[] {
    return person.map((p:Party) => {
      return {label: p.firstName+" "+p.lastName, value: p.partyId};
    });
}

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {
  _reload: Subject<void>;
  /** Default partyId in Select*/
  defaultParty: Party;
  displayDialog: boolean;
  /** Error message from be*/
  error = '';
  form: FormGroup;
  /** Info message in Toast*/
  msgs: Message[] = [];
  timesheets: Timesheet[];
  /** whether create or update */
  newTimesheet: boolean;
  /** Timesheet to save*/
  timesheet: Timesheet = new PrimeTimesheet();
  /** Selected timesheet in Dialog*/
  selectedTimesheet: Timesheet;
  /** Selected PartyIdd in Select*/
  selectedPartyId: string;
  /** List of Party in Select */
  partySelectItem: SelectItem[] = [];

  constructor(
    private readonly timesheetService: TimesheetService,
    private readonly partyService: PartyService,
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
    this.route.data.pipe(
      map((data: { timesheets: Timesheet[] }) => data.timesheets)
    ).subscribe(data => this.timesheets = data);

    const reloadedParty = this._reload.switchMap(() => this.partyService.partys());
    const reloadedTimesheets = this._reload.switchMap(() => this.timesheetService.timesheets());

    const partyObs = this.route.data.pipe(
      map((data: { partys: Party[] }) => data.partys),
      merge(reloadedParty),
      map(party2SelectItems)
    ).subscribe((data) => {
      this.partySelectItem = data;
      this.partySelectItem.push({label: this.i18nService.translate('Select Party'), value:null});
    });

    const timesheetsObs = this.route.data.pipe(
      map((data: { timesheets: Timesheet[] }) => data.timesheets),
      merge(reloadedTimesheets)
    ).subscribe((data) => {
      this.timesheets = data;
    });
  }

  confirm() {
    this.confirmationService.confirm({
      message: this.i18nService.translate('Do you want to delete this record?'),
      header: this.i18nService.translate('Delete Confirmation'),
      icon: 'fa fa-trash-alt',
      accept: () => {
        this.displayDialog = false;
        this._delete();
      },
      reject: () => {
          this.timesheet = null;
          this.displayDialog = false;
        }
    });
  }

  onRowSelect(data: Timesheet) {
    this.router.navigate([data.timesheetId], { relativeTo: this.route });
  }

  save() {
    this.timesheet.partyId = this.selectedPartyId;
    if (this.newTimesheet) {
      this.timesheetService
        .createTimesheet(this.timesheet)
        .then(() => {
          this.timesheet = null;
          this.displayDialog = false;
          this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Created'), detail:this.i18nService.translate('Record created')}];
          this._reload.next();
        })
        .catch((error) => {
          console.log('error' , error.message);
          this.error = this.i18nService.translate(error.message) || error;
        });
    } else {
      this.timesheetService
        .updateTimesheet(this.selectedTimesheet.timesheetId, this.timesheet)
        .then(data => {
          this.timesheet = null;
          this.displayDialog = false;
          this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Updated'), detail:this.i18nService.translate('Record updated')}];
          this._reload.next();
        })
        .catch((error) => {
          console.log('error' , error.message);
          this.error = this.i18nService.translate(error.message) || error;
        });
    }
  }

  showDialogToAdd() {
    this.error = '';
    this.newTimesheet = true;
    this.timesheet = new PrimeTimesheet();
    this.displayDialog = true;
    //this.selectedPartyId = this.defaultParty.partyId;
  }

  selectTimesheet(data: Timesheet) {
    this.error = '';
    this.selectedTimesheet = data;
    if(this.selectedTimesheet.fromDate)this.selectedTimesheet.fromDate=moment(this.selectedTimesheet.fromDate).toDate();
    if(this.selectedTimesheet.thruDate)this.selectedTimesheet.thruDate=moment(this.selectedTimesheet.thruDate).toDate();

    this.newTimesheet = false;
    this.timesheet = this._cloneTimesheet(data);
    this.selectedPartyId = data.partyId;
    this.displayDialog = true;
  }

  _cloneTimesheet(t: Timesheet): Timesheet {
    let timesheet = new PrimeTimesheet();
    for(let prop in timesheet) {
      timesheet[prop] = t[prop];
    }
    return timesheet;
  }

  _delete() {
    this.timesheetService
    .deleteTimesheet(this.selectedTimesheet.timesheetId)
    .then(data => {
      this.timesheet = null;
      this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Confirmed'), detail:this.i18nService.translate('Record deleted')}];
      this._reload.next();
    })
    .catch((error) => {
      console.log('error' , error.message);
      this.error = this.i18nService.translate(error.message) || error;
    });
  }

}

class PrimeTimesheet implements Timesheet {
  constructor(public partyId?: string, public partyName?: string, public timesheetId?: string, public fromDate?: Date ,
              public thruDate?: Date, public contractHours?: number, public actualHours?: number) {}
}

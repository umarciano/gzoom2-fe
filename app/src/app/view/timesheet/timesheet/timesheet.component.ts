import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/switchMap';

import { SelectItem } from '../../../commons/selectitem';
import { I18NService } from '../../../commons/i18n.service';
import { Message } from '../../../commons/message';
import {Timesheet} from './timesheet';
import { TimesheetService } from '../../../api/timesheet.service';

import {Party} from '../../party/party/party';
import {PartyService} from '../../../api/party.service';

/** Convert from Party[] to SelectItem[] */
// function party2SelectItems(party: Party[]): SelectItem[] {
//     return party.map((p:Party) => {
//       return {label: p.description, value: p.partyId};
//     });
// }

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
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly i18nService: I18NService,
    private fb: FormBuilder) {

    this._reload = new Subject<void>();
  }

  ngOnInit() {
    this.form = this.fb.group({
            // 'partyId': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
            'partyId': new FormControl(''),
            'fromDate': new FormControl(''),
            'thruDate': new FormControl(''),
            'contractHours': new FormControl(''),
            'actualHours': new FormControl('')

        });
    this.route.data
      .map((data: { timesheets: Timesheet[] }) => data.timesheets)
      .subscribe(data => this.timesheets = data);

    const reloadedParty = this._reload.switchMap(() => this.partyService.partys());

    const partyObs = this.route.data
      .map((data: { partys: Party[] }) => data.partys)
      .merge(reloadedParty);

    //partyObs.first().subscribe(partys => this.defaultParty = partys[0]);

    // partyObs
    //   .map(party2SelectItems)
    //   .subscribe((data) => {
    //     this.partySelectItem = data;
    //     this.partySelectItem.push({label: this.i18nService.translate('Select Party'), value:null});
    //   });

  }

  save(): void {
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
    }
/*
     else {
      this.uomService
        .updateUomType(this.selectedUomType.uomTypeId, this.uomType)
        .then(data => {
          this.uomType = null;
          this.displayDialog = false;
          this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Updated'), detail:this.i18nService.translate('Record updated')}];
          this._reload.next();
        })
        .catch((error) => {
          console.log('error' , error.message);
          this.error = this.i18nService.translate(error.message) || error;
        });
    } */
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
    this.newTimesheet = false;
    this.timesheet = this.cloneTimesheet(data);
    this.displayDialog = true;
  }

  cloneTimesheet(t: Timesheet): Timesheet {
    let timesheet = new PrimeTimesheet();
    for(let prop in timesheet) {
      timesheet[prop] = t[prop];
    }
    return timesheet;
  }

}

class PrimeTimesheet implements Timesheet {
  constructor(public timesheetId?: string, public partyId?: string) {}
}

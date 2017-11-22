import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import {TimeEntry} from './time_entry';
import {Timesheet} from '../timesheet/timesheet';

import { ConfirmDialogModule, ConfirmationService, SpinnerModule, TooltipModule } from 'primeng/primeng';
import { SelectItem } from '../../../commons/selectitem';
import { Message } from '../../../commons/message';
import { I18NService } from '../../../commons/i18n.service';
import { TimesheetService } from '../../../api/timesheet.service';

@Component({
  selector: 'app-time-entry',
  templateUrl: './time-entry.component.html',
  styleUrls: ['./time-entry.component.css']
})
export class TimeEntryComponent implements OnInit {

  timeEntries: Timesheet[];

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
  selectedTimeEntry: TimeEntry;

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
    this.route.data
      .map((data: { timeEntries: Timesheet[] }) => data.timeEntries)
      .subscribe(data => this.timeEntries = data);
  }

}

class PrimeTimeEntry implements TimeEntry {
  constructor(public timeEntryId?: string, public description?: string) { }
}

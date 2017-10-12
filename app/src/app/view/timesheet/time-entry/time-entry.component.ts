import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import {TimeEntry} from './time_entry';

@Component({
  selector: 'app-time-entry',
  templateUrl: './time-entry.component.html',
  styleUrls: ['./time-entry.component.css']
})
export class TimeEntryComponent implements OnInit {

  timeEntries: TimeEntry[];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
  }

  ngOnInit() {
    this.route.data
      .map((data: { timeEntries: TimeEntry[] }) => data.timeEntries)
      .subscribe(data => this.timeEntries = data);
  }

}

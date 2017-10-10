import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import {Timesheet} from './timesheet';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  timesheets: Timesheet[];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
  }

  ngOnInit() {
    this.route.data
      .map((data: { timesheets: Timesheet[] }) => data.timesheets)
      .subscribe(data => this.timesheets = data);
  }

}

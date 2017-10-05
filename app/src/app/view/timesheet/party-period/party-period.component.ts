import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import {PartyPeriod} from './party_period';

@Component({
  selector: 'app-party-period',
  templateUrl: './party-period.component.html',
  styleUrls: ['./party-period.component.css']
})
export class PartyPeriodComponent implements OnInit {

  partyPeriods: PartyPeriod[];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
  }

  ngOnInit() {
    this.route.data
      .map((data: { partyPeriods: PartyPeriod[] }) => data.partyPeriods)
      .subscribe(data => this.partyPeriods = data);
  }

}

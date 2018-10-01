import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { first, map, merge, switchMap } from 'rxjs/operators';
import * as moment from 'moment';

import { SelectItem } from '../../../commons/selectitem';
import { I18NService } from '../../../commons/i18n.service';
import { Message } from '../../../commons/message';

import { Report } from '../../../report/report';
import { ReportService } from '../../../api/report.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';

@Component({
  selector: 'app-report-example',
  templateUrl: './report-example.component.html',
  styleUrls: ['./report-example.component.css']
})

export class ReportExampleComponent implements OnInit {
  /** Error message from be*/
  error = '';

  /** List of Report */
  reports: Report[];
  
  /** Selected report*/
  selectedReport: Report;

  constructor(private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly i18nService: I18NService,
    private readonly reportService: ReportService,
    private fb: FormBuilder, http: HttpClient) {
      // concatMap if request longer more 5 sec
      /*this.pollingData = Observable.interval(5000).startWith(0)
       .switchMap(() => http.get('http://jsonplaceholder.typicode.com/users/'))
       .pipe(
        map(json => json)
      ).subscribe((data: any[]) => {
         this.doctors=data; 
         console.log(data);// see console you get output every 5 sec
      });*/
      /*  map((data) => data.json())
        ).subscribe((data) => {
             this.doctors=data; 
              console.log(data);// see console you get output every 5 sec
           });*/
  }

  ngOnInit() {
    /*this.form = this.fb.group({
      'partyId': new FormControl('', Validators.required),
      'fromDate': new FormControl('', Validators.required),
      'thruDate': new FormControl('', Validators.required),
      'contractHours': new FormControl(''),
      'actualHours': new FormControl('')
    });*/

    const reportObs = this.route.data.pipe(
      map((data: { reports: Report[] }) => data.reports) //,
      //merge(reloadedUoms)
    );
      
    reportObs.pipe(first())
    .subscribe((reports) => {
      this.reports = reports;
      this.onRowSelect(reports[0]);
    });

    /*reportObs.subscribe((data) => {
      this.reports = data;
      this.selectedReport = data[0];
      this.router.navigate([this.selectedReport.reportContentId], { relativeTo: this.route });
    });*/

  }

  onRowSelect(data) {
    console.log('report ', data);

    this.selectedReport = data;
    if (this.selectedReport) {
      this.router.navigate([this.selectedReport.reportContentId], { relativeTo: this.route });
    }
  }

 // print() {
    /*this.timesheet.partyId = this.selectedPartyId;
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
      }*/
      // this.reportService
      //   .add(this.selectedReport)
      //   .then(data => {
          /*this.timesheet = null;
          this.displayDialog = false;
          this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Created'), detail:this.i18nService.translate('Record created')}];
          this._reload.next();*/
  //         console.log(" id data " + data);
  //       })
  //       .catch((error) => {
  //         console.log('error' , error.message);
  //         this.error = this.i18nService.translate(error.message) || error;
  //       });
  // }

  
/*   ngOnDestroy() {
    this.pollingData.unsubscribe();
  } */
}

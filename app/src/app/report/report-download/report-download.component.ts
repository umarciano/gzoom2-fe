import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { SelectItem } from '../../commons/selectitem';
import { I18NService } from '../../commons/i18n.service';
import { Message } from '../../commons/message';

import { Report } from '../../report/report';
import { ReportStatus } from '../../report/report-status';
import { ReportService } from '../../api/report.service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { first, map, merge, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';
import { Output } from '@angular/compiler/src/core';

@Component({
  selector: 'app-report-download',
  templateUrl: './report-download.component.html',
  styleUrls: ['./report-download.component.css']
})
export class ReportDownloadComponent implements OnInit {
  doctors = [];
  pollingData: any;
  selectedActivityId: string;
  reportStatus: ReportStatus;

  pippo: any;

  constructor(private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly i18nService: I18NService,
    private readonly reportService: ReportService,
    private fb: FormBuilder, http: HttpClient) {
      
      this.pollingData = Observable.interval(5000)
      .switchMap((params) => {
        return this.reportService.status(this.selectedActivityId);
      })
      .subscribe((data) => { 
        this.reportStatus = data;
        if(this.reportStatus.activityStatus == 'DONE') {
          //dovrei fare il downloadd 
          console.log('PIPPO=', this.selectedActivityId);
          //this.router.navigate(['stream'], { relativeTo: this.route });
          this.pippo = this.reportService.stream(this.selectedActivityId);
         // var newWindow = window.open('/c/report-example-1/report-download/' + this.selectedActivityId+ "/stream");
         this.ngOnDestroy();
        }
        if(this.reportStatus.activityStatus != 'RUNNING') { 
          this.ngOnDestroy();
        }
        console.log('reportStatus', this.reportStatus);
      });

      this.route.paramMap
      .switchMap((params) => {
        console.log('switchMap'+ params);
        this.selectedActivityId = params.get('activityId');
        return this.reportService.status(this.selectedActivityId);
      })
      .subscribe((data) => { 
        this.reportStatus = data;
        console.log('reportStatus', this.reportStatus);
      });


      this.route.paramMap
      .switchMap((params) => {
        console.log('switchMap'+ params);
        this.selectedActivityId = params.get('activityId');
        return this.reportService.stream(this.selectedActivityId);
      })
      .subscribe((data) => { 
        this.reportStatus = data;
        console.log('reportStatus', this.reportStatus);
      });

      
      /* non unsubscrive xke non so su chi farlo  this.route.paramMap
      .switchMap((params) => {
        this.selectedContentId = params.get('contentId');
        return = Observable.interval(5000).startWith(0);
      }).subscribe((data) => { 
        this.reportStatus = data;
        if(this.reportStatus.activityStatus != 'RUNNING') {
          this.ngOnDestroy();
        }
        console.log('reportStatus'+ this.reportStatus);
      });

      // manca l'id xke params e i lcontatore this.pollingData = Observable.interval(5000).startWith(0);
      /*.switchMap((params) => {
        console.log('switchMap'+ params);
        return this.reportService.status(""10000");
      })
      .subscribe((data) => { 
        this.reportStatus = data;
        if(this.reportStatus.activityStatus != 'RUNNING') {
          this.ngOnDestroy();
        }
        console.log('reportStatus'+ this.reportStatus);
      });*/

      /*this.reportService
      .status("10000")
      .then(() => {
        this.reportStatus = null;
        this.displayDialog = false;
        this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Created'), detail:this.i18nService.translate('Record created')}];
        this._reload.next();
      })
      .catch((error) => {
        console.log('error' , error.message);
        this.error = this.i18nService.translate(error.message) || error;
      });*/

      // concatMap if request longer more 5 sec
      /*this.pollingData = Observable.interval(5000).startWith(0)
       .switchMap(() => http.get('http://jsonplaceholder.typicode.com/users/'))
       .pipe(
        map(json => json)
      ).subscribe((data: any[]) => {
         this.doctors=data; 
         console.log(data);// see console you get output every 5 sec
      });*/
    }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.pollingData.unsubscribe();
  }
}

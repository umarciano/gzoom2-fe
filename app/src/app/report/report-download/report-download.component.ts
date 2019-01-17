import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { SelectItem } from '../../commons/selectitem';
import { I18NService } from '../../commons/i18n.service';
import { Message } from '../../commons/message';
import { AuthService } from '../../commons/auth.service';

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
    private readonly authService: AuthService,
    private fb: FormBuilder, http: HttpClient) {
      
      this.pollingData = Observable.interval(2000)
      .switchMap((params) => {
        return this.reportService.status(this.selectedActivityId);
      })
      .subscribe((data) => { 
        this.reportStatus = data;
        if(this.reportStatus.activityStatus == 'DONE') {
          //dovrei fare il downloadd 
          console.log('selectedActivityId=', this.selectedActivityId);
          window.open('rest/report/'+ this.selectedActivityId +'/stream?token=' + authService.token());
          
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
      
    }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.pollingData.unsubscribe();
  }
}

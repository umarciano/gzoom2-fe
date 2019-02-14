import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { SelectItem } from '../../commons/selectitem';
import { I18NService } from '../../commons/i18n.service';
import { Message } from '../../commons/message';
import { AuthService } from '../../commons/auth.service';


import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { first, map, merge, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';
import { Output } from '@angular/compiler/src/core';

import { ReportDownloadService } from '../../api/report-download.service';
import { ReportActivity } from 'app/report/report';

@Component({
  selector: 'app-report-download',
  templateUrl: './report-download.component.html',
  styleUrls: ['./report-download.component.css']
})
export class ReportDownloadComponent implements OnInit {
  _reload: Subject<void>;

  doctors = [];
  pollingData: any;
  token: string;

  reports: ReportActivity[];

  constructor(private readonly route: ActivatedRoute,
    private readonly reportDownloadService: ReportDownloadService,
    private readonly authService: AuthService,
    private readonly i18nService: I18NService, http: HttpClient) {
      this._reload = new Subject<void>();
      this.token = authService.token();
    }

  ngOnInit() {
    this.polling();

    /*console.log('reportDownloads ngOnInit');
    const reloaded = this._reload.switchMap(() => this.reportDownloadService.reportDownloads());
    const reportObs = this.route.data.pipe(
      map((data: { reportActivitys: ReportActivity[] }) => data.reportActivitys),
      merge(reloaded),
    ).subscribe((data) => {
       this.reports = data;
    });

    this._reload.next();*/
/*
    this.route.paramMap
      .switchMap((params) => {
        return this.reportDownloadService.reportDownloads();
      })
      .subscribe((data) => { 
        this.reports = data;
      });*/
  }

  polling() {
    this.pollingData = Observable.interval(9000)
      .switchMap((params) => {
        return this.reportDownloadService.reportDownloads();
      })
      .subscribe((data) => { 
        this.reports = data;
        var running = false;
        this.reports.forEach((element) => {
          if (element.status == 'RUNNING') {
            running = true;
          }
        });
        if (!running) {
          //this.ngOnDestroy();
        }
       /* if(this.reportStatus.activityStatus == 'DONE') {
          //dovrei fare il downloadd 
          console.log('selectedActivityId=', this.selectedActivityId);
          window.open('rest/report/'+ this.selectedActivityId +'/stream?token=' + authService.token());
          
          this.ngOnDestroy();
        }
        if(this.reportStatus.activityStatus != 'RUNNING') { 
          this.ngOnDestroy();
        }
        console.log('reportStatus', this.reportStatus);*/       

      });
  }

  onDeleteSelect(data: ReportActivity) {    
    console.log('onDeleteSelect');
    this.reportDownloadService
      .delete(data.activityId);   
       
  }

  ngOnDestroy() {
    this.pollingData.unsubscribe();
  }

  onClick(reportDownload) {
    if (reportDownload.isOpen()) 
      this.polling();
  }
}

import { Component, OnInit} from '@angular/core';

import { ActivatedRoute, Router, Params } from '@angular/router';

import { I18NService } from '../../i18n/i18n.service';
import { AuthService } from '../../commons/auth.service';

import { Observable ,  Subject, interval, BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';

import { ReportDownloadService } from '../../api/report-download.service';
import { ReportActivity } from '../../view/report-print/report';
import { ApiClientService } from 'app/api/client.service';
import { DownloadActivityService } from './download-activity.service';


@Component({
  selector: 'app-report-download',
  templateUrl: './report-download.component.html',
  styleUrls: ['./report-download.component.css']
})
export class ReportDownloadComponent implements OnInit {
  _reload: Subject<void>;

  doctors = [];
  pollingData: any;
  isPolling: boolean;
  token: string;
  reports: ReportActivity[];
  runElement = [];
  activities: Subject<boolean> = new Subject<boolean>();

  constructor(private readonly route: ActivatedRoute,
    private readonly reportDownloadService: ReportDownloadService,
    private readonly authService: AuthService,
    public readonly downloadActivityService: DownloadActivityService,
    private readonly i18nService: I18NService, http: HttpClient,
    private readonly clientService: ApiClientService) {
      this._reload = new Subject<void>();
      this.token = authService.token();
    }

  ngOnInit() {
    this.polling();
    this.downloadActivityService.getActivities().subscribe(
     (x) => this.activities.next(x)
    );

    //this.dropdown.open();
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
    console.log('reportDownloads polling');
    this.isPolling = true;

    this.pollingData = interval(1000)
      .pipe(switchMap(() => this.reportDownloadService.reportDownloads()) )
      .subscribe((data) => {
        this.reports = data;
        var running = false;
        this.reports.forEach((element) => {
          if (element.status == 'RUNNING') {
            running = true;
          } else if (element.status == 'DONE' && this.runElement.indexOf(element.activityId) >= 0 ) {
              window.open(this.reportUrl(element));
              this.runElement.splice(this.runElement.indexOf(element.activityId), 1);
          }
        });
        if (!running) {
          this.ngOnDestroy();
        }

      });
  }

  onDeleteSelect(data: ReportActivity) {
    console.log('onDeleteSelect');
    this.reportDownloadService
      .delete(data.activityId);
  }

  ngOnDestroy() {
    this.pollingData.unsubscribe();
    this.isPolling = false;
  }

  onClick(reportDownload) {
    if (reportDownload.isOpen() && !this.isPolling)
      this.polling();
  }

  openDownload(activityId) {
    console.log("openDownload");
    this.runElement.push(activityId);
    if(!this.isPolling)
       this.polling();
    this.downloadActivityService.openDownload();
  }

  reportUrl(report:ReportActivity):string{
    return this.clientService.makeUrl(`report-download/${report.activityId}/stream?token=${this.token}`);
  }

}

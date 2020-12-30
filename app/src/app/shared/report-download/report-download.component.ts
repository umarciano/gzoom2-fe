import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';

import { ActivatedRoute, Router, Params } from '@angular/router';

import { AuthService } from '../../commons/auth.service';

import { Subject, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import 'rxjs/Rx';

import { ReportDownloadService } from '../../api/report-download.service';
import { ReportActivity } from '../../view/report-print/report';
import { ApiClientService } from 'app/api/client.service';
import { DownloadActivityService } from './download-activity.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-report-download',
  templateUrl: './report-download.component.html',
  styleUrls: ['./report-download.component.css']
})
export class ReportDownloadComponent implements OnInit, OnDestroy {
  /**
   * Token per autenticazione utente
   */
  token: string;
  runElement = [];
  /**
   * Lista di nuove stampe lanciate dall'utente
   */
  activities: Subject<string> = new Subject<string>();
  /**
   * Lista di report che compare nella dropdown in alto a sinistra
   */
  reports: ReportActivity[];
  /**
   * Observable legato a reports
   */
  pollingData: any;

  /**
   * usato per far riferimento alla dropdown reportDownload (nel DOM),
   * in modo da poterla aprire quando parte una nuova stampa
   */
  @ViewChild('reportDownload') reportDownload: NgbDropdown;

  constructor(private readonly route: ActivatedRoute,
    private readonly reportDownloadService: ReportDownloadService,
    private readonly authService: AuthService,
    public readonly downloadActivityService: DownloadActivityService,
    private readonly clientService: ApiClientService) {
      this.authService = authService;
      this.token = this.authService.token();
    }

  ngOnInit() {
    // sottoscrizione ad una lista di attivita'
    // la lista viene aggiornata quando viene lanciata una nuova stampa con un activityId valorizzato
    this.downloadActivityService.getActivities().subscribe(
     (activityId) => {
       if (activityId != null) {
        this.reportDownload.open();
       }
       this.activities.next(activityId);
       this.runElement.push(activityId);
     }
    );
  }

  /**
   * Interrompe il polling e ripulisce la lista di reports
   */
  ngOnDestroy() {
    this.stopPolling();
    this.reports = [];
  }

  startPolling() {
    this.pollingData = interval(1000).startWith(0).pipe(switchMap(() => this.reportDownloadService.reportDownloads()) )
      .subscribe((data) => {
        this.reports = data;
        var running = false;
        data.forEach((element) => {
          if (element.status == 'RUNNING') {
            running = true;
          } else if (element.status == 'DONE' && this.runElement.indexOf(element.activityId) >= 0 ) {
              window.open(this.reportUrl(element));
              this.runElement.splice(this.runElement.indexOf(element.activityId), 1);
          }
        });
        // se nessuna stampa e' in attesa di essere eseguita, il polling si interrompe
        if (!running) {
          this.stopPolling();
        }
      });
  }

  onDeleteSelect(data: ReportActivity) {
    this.reportDownloadService
      .delete(data.activityId);
  }

  /**
   * Interrompe il polling
   */
  stopPolling() {
    if(this.pollingData)
      this.pollingData.unsubscribe();
  }

  toggled(event) {
    if (event) {
      this.startPolling();
    } else {
      this.stopPolling();
      this.reports = [];
    }
  }

  reportUrl(report:ReportActivity):string{
    return this.clientService.makeUrl(`report-download/${report.activityId}/stream?token=${this.token}`);
  }

}

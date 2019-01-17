import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { ApiClientService } from './client.service';

import { Report } from '../report/report';
import { ReportStatus } from '../report/report-status';


import * as moment from 'moment';
import * as _ from 'lodash';


@Injectable()
export class ReportService {

  constructor(private client: ApiClientService) { }

  reports(parentTypeId: string): Observable<Report[]> {
    console.log('search reports with ' + parentTypeId);
    return this.client
      .get(`report/${parentTypeId}`).pipe(
        map(json => json.results as Report[])
      );
  }

  report(parentTypeId: string, reportContentId: string): Observable<Report> {
    console.log('search report with ' + reportContentId);
    return this.client
      .get(`report/${parentTypeId}/${reportContentId}`).pipe(
        map(json => json as Report)
      );
  }

  add(report) {
    console.log('add ', report);
    return this.client
    .post('report/add', report)
    .toPromise()
    .then(response => response)
    .catch(response => {
      console.error(`Error while creating in: ${response}`);
      return Promise.reject(response.json() || response);
    });
  }

  status(activityId) {
    console.log('status ');
    return this.client
      .get(`report/${activityId}/status`).pipe(
        map(json => json as ReportStatus)
      );
  }
  
  delete(contentId) {
    console.log('delete ');
    return this.client
      .delete(`report/${contentId}`).pipe(
        map(json => json as Report)
      );
  }

  //Bodifier methods
  saveReportBodifier(report) {
    return {
      reportName: (report) ? report.reportName : null,
      reportLocale: (report) ? report.reportLocale : null, // TODO "it_IT"
      params: {
        "date3112": this.getDate(report.date3112),
        "langLocale": "",
        "outputFormat": "pdf",
        "workEffortTypeId": "15AP0PPC",
        "exposeReleaseDate": "Y",
        "exposePaginator": "Y",
        "reportContentId": "REPORT_CATALOGO",
        "userLoginId": "admin",
        "userProfile": "MGR_ADMIN",
        "birtOutputFileName": "CatalogoTreLivelli",
        "localDispatcherName": "corperf",
        "defaultOrganizationPartyId": "Company",
        
        }
    };
  }

  getDate(date) {
    if (date) return moment(date).format("YYYY-MM-DD");
    else return null;
  }

}

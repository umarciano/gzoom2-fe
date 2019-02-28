import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from './client.service';

import { Report } from '../view/report-example/report';

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

  report(parentTypeId: string, reportContentId: string, reportName: string, analysis: boolean): Observable<Report> {
    console.log('search report with ' + reportContentId + " reportName "+ reportName + " analysis " + analysis );
    return this.client
      .get(`report/${parentTypeId}/${reportContentId}/${reportName}/${analysis}`).pipe(
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

  mail(report) {
    console.log('mail ', report);
    return this.client
    .post('report/mail', report)
    .toPromise()
    .then(response => response)
    .catch(response => {
      console.error(`Error while creating in: ${response}`);
      return Promise.reject(response.json() || response);
    });
  }

  getDate(date) {
    if (date) return moment(date).format("YYYY-MM-DD");
    else return null;
  }

}

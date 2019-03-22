import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from './client.service';

import { Report } from '../view/report-print/report';

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
      ).catch((response: any) => {
        console.error(`Error get all reports: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  report(parentTypeId: string, reportContentId: string, reportName: string, analysis: boolean): Observable<Report> {
    console.log('search report with ' + reportContentId + " reportName "+ reportName + " analysis " + analysis );
    return this.client
      .get(`report/${parentTypeId}/${reportContentId}/${reportName}/${analysis}`).pipe(
        map(json => json as Report)
      ).catch((response: any) => {
        console.error(`Error get report: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  async add(report: Report):  Promise<String> {
    console.log('add ', report);
    try {
      const response = await this.client
        .post('report/add', report)
        .toPromise();
      return response;
    }
    catch (response_1) {
      console.error(`Error report add : ${response_1}`);
      return Promise.reject(response_1.message || response_1);
    }
  }

  async mail(report: Report):  Promise<String> {
    console.log('mail ', report);
    try {
      const response = await this.client
        .post('report/mail', report)
        .toPromise();
      return response;
    }
    catch (response_1) {
      console.error(`Error report mail: ${response_1}`);
      return Promise.reject(response_1.message || response_1);
    }
  }

  getDate(date: Date) {
    if (date) return moment(date).format("YYYY-MM-DD");
    else return null;
  }
}

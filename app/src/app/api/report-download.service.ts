import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from './client.service';

import { ReportActivity } from '../view/report-print/report';

import * as moment from 'moment';
import * as _ from 'lodash';


@Injectable()
export class ReportDownloadService {

  constructor(private client: ApiClientService) { }

  reportDownloads(): Observable<ReportActivity[]> {   
    return this.client
      .get(`report-download`).pipe(
        map(json => json.results as ReportActivity[])
      ).catch((response: any) => {
        console.error(`Error while report-download: ${response}`);
        return Promise.reject(response.json() || response);
      }

      );
  }

  status(activityId: String) {
    console.log('status activityId='+activityId);
    return this.client
      .get(`report-download/${activityId}/status`).pipe(
        map(json => json as ReportActivity)
      );
  }
  
  delete(activityId: String) {
    console.log('delete activityId='+activityId);
    return this.client      
      .delete(`report-download/${activityId}`)
      .toPromise()
      .then(response => response)
      .catch((response: any) => {
        console.error(`Error while deleting in: ${response}`);
        return Promise.reject(response.message || response);
      });
  }
}

import { Injectable } from '@angular/core';

import { lastValueFrom, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as _ from 'lodash';
import { ReportActivity } from 'app/view/report-print/report';
import { ApiClientService } from 'app/commons/service/client.service';


@Injectable()
export class ReportDownloadService {

  constructor(private client: ApiClientService) { }

  reportDownloads(): Observable<ReportActivity[]> {
    return this.client
      .get(`report-download`).pipe(
        map(json => json.results as ReportActivity[]),
        catchError((response: any) => {
          console.error(`Error while report-download: ${response}`);
          return Promise.reject(response.json() || response);
        })
      )
      // .catch((response: any) => {
      //   console.error(`Error while report-download: ${response}`);
      //   return Promise.reject(response.json() || response);
      // }

      // );
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

    const client$ = this.client.delete(`report-download/${activityId}`);
    return lastValueFrom(client$).then(response => response)
    .catch((response: any) => {
      console.error(`Error while deleting in: ${response}`);
      return Promise.reject(response.message || response);
    });
    // return this.client
    //   .delete(`report-download/${activityId}`)
    //   .toPromise()
    //   .then(response => response)
    //   .catch((response: any) => {
    //     console.error(`Error while deleting in: ${response}`);
    //     return Promise.reject(response.message || response);
    //   });
  }
}

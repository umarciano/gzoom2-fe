import { Injectable } from '@angular/core';
import { ApiClientService } from './client.service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { QueryConfig } from '../view/query-config/query-config/query-config';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ResponseType } from '@angular/http';
import { AuthService } from 'app/commons/auth.service';

@Injectable()
export class QueryConfigService {
  constructor(private readonly client: ApiClientService,
    private http: HttpClient,
    private readonly authService: AuthService) {
    }


  queryConfigs(parentTypeId: string, queryType: string): Observable<QueryConfig[]> {
    console.log('search query config');
    if (parentTypeId && queryType) {
      return this.client
      .get(`query-config/all/${parentTypeId}/${queryType}`).pipe(
        map(json => json.results as QueryConfig[])
      );
    } else {
      return this.client
        .get('query-config/all').pipe(
          map(json => json.results as QueryConfig[])
        );
    }
  }

  getQueryConfig(id: string): Observable<QueryConfig> {
    return this.client
    .get(`query-config/id/${id}`)
    .pipe(map(json => json as QueryConfig));
  }

  executeQuery(query: QueryConfig)  {
      return this.client
      .postBlob(`query-config/exec`, query)
      .toPromise()
      .then(response => this.downLoadFile(query, response,"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
      .catch((response: any) => {
        console.error(`Error while deleting in: ${response}`);
        return Promise.reject(response.message || response);
      });
  }

  updateQuery(query: QueryConfig): Promise<QueryConfig>  {
    return this.client
    .post(`query-config/exec`, query)
    .toPromise()
    .then(response => response)
    .catch((error: HttpErrorResponse ) => {
      const _error = error.error.message;
      console.error(`Error while exec query: ${_error}`);
      return Promise.reject(_error);
    });
   }

  downLoadFile(query: QueryConfig, data: any, type: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    let anchor = document.createElement('a');
    anchor.download = 'export_'+ query.queryName + '.xlsx';
    anchor.href = url;
    anchor.click();
    }

}

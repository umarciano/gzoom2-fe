import { Injectable } from '@angular/core';
import { ApiClientService } from './client.service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { QueryConfig } from '../view/query-config/query-config/query-config';
import { HttpClient } from '@angular/common/http';
import { ResponseType } from '@angular/http';
import { AuthService } from 'app/commons/auth.service';

@Injectable()
export class QueryConfigService {
  constructor(private readonly client: ApiClientService,
    private http: HttpClient,
    private readonly authService: AuthService) {
    }


  queryConfigs(): Observable<QueryConfig[]> {
    console.log('search query config');
    return this.client
      .get('query-config/all').pipe(
        map(json => json.results as QueryConfig[])
      );
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
    .then(response => this.downLoadFile(query,response,"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
    .catch((response: any) => {
      console.error(`Error while deleting in: ${response}`);
      return Promise.reject(response.message || response);
    });
  }

  downLoadFile(query: QueryConfig, data: any, type: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    let anchor = document.createElement('a');
    anchor.download = 'query_' + query.queryId + '.xlsx';
    anchor.href = url;
    anchor.click();
    }

}

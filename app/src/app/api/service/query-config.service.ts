import { Injectable } from '@angular/core';
import { ApiClientService } from '../../commons/service/client.service';

import { lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { QueryConfig } from '../../view/query-config/query-config/query-config';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'app/commons/service/auth.service';

@Injectable()
export class QueryConfigService {

  private static readonly CSVmime = "text/csv";
  private static readonly PDFmime = "application/pdf";
  private static readonly XLSXmime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  constructor(private readonly client: ApiClientService,
    private http: HttpClient,
    private readonly authService: AuthService) {
    }


  queryConfigs(parentTypeId: string, queryType: string): Observable<QueryConfig[]> {
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

    const client$ = this.client.postBlob(`query-config/exec`, query);
    return lastValueFrom(client$).then(response => this.downLoadFile(query, response, query.exportMimeType))
    .catch(async (error) => {
      const _error = JSON.parse(await error.error.text()).message;
      console.error(`Error while deleting in:`, _error);
      return Promise.reject(_error);
    });

      // return this.client
      // .postBlob(`query-config/exec`, query)
      // .toPromise()
      // .then(response => this.downLoadFile(query, response, query.exportMimeType))
      // .catch(async (error) => {
      //   const _error = JSON.parse(await error.error.text()).message;
      //   console.error(`Error while deleting in:`, _error);
      //   return Promise.reject(_error);
      // });
  }

  updateQuery(query: QueryConfig): Promise<QueryConfig>  {

    const client$ = this.client.post(`query-config/exec`, query);
    return lastValueFrom(client$).then(response => response)
    .catch((error: HttpErrorResponse ) => {
      const _error = error.error.message;
      console.error(`Error while exec query: ${_error}`);
      return Promise.reject(_error);
    });

    // return this.client
    // .post(`query-config/exec`, query)
    // .toPromise()
    // .then(response => response)
    // .catch((error: HttpErrorResponse ) => {
    //   const _error = error.error.message;
    //   console.error(`Error while exec query: ${_error}`);
    //   return Promise.reject(_error);
    // });
   }

  downLoadFile(query: QueryConfig, data: any, type: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    let anchor = document.createElement('a');
    if(query.exportMimeType == QueryConfigService.PDFmime)
      anchor.download = 'export_'+ query.queryName + '.pdf';
    else if (query.exportMimeType == QueryConfigService.XLSXmime)
      anchor.download = 'export_'+ query.queryName + '.xlsx';
    else if(query.exportMimeType == QueryConfigService.CSVmime)
      anchor.download = 'export_'+ query.queryName + '.csv';
    anchor.href = url;
    anchor.click();
    }

}

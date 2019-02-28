import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from './client.service';

import { WorkEffort } from '../view/work-effort/work-effort/work-effort';

@Injectable()
export class WorkEffortService {

  constructor(private client: ApiClientService) { }

  /*workEfforts(): Observable<WorkEffort[]> {
    console.log('search workEffort list');
    return this.client
      .get(`work-effort`).pipe(
        map(json => json.results as WorkEffort[])
      );
  }*/

  workEfforts(parentTypeId: string, workEffortTypeId: string, useFilter?: boolean): Observable<WorkEffort[]> {
    console.log('search workEffort list with workEffortTypeId='+ workEffortTypeId);
    if (useFilter == undefined) 
      useFilter = true;
    return this.client
      .get(`work-effort/${parentTypeId}/${workEffortTypeId}/${useFilter}`).pipe(
        map(json => json.results as WorkEffort[])
      );
  }

  workEffortParents(workEffortParentId: string): Observable<WorkEffort[]> {
    console.log('search workEffort list with workEffortParentId='+ workEffortParentId);
    return this.client
      .get(`work-effort/work-effort-parent/${workEffortParentId}`).pipe(
        map(json => json.results as WorkEffort[])
      );
  }
}

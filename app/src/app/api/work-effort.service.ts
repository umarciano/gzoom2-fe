import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
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

  workEfforts(workEffortTypeId: string): Observable<WorkEffort[]> {
    console.log('search workEffort list with workEffortTypeId='+ workEffortTypeId);
    return this.client
      .get(`work-effort/${workEffortTypeId}`).pipe(
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

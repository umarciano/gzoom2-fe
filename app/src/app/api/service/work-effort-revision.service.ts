import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from '../../commons/service/client.service';

import { WorkEffortRevision } from '../model/workEffortRevision';

@Injectable()
export class WorkEffortRevisionService {

  constructor(private client: ApiClientService) { }

  workEffortRevisions(workEffortTypeId: string): Observable<WorkEffortRevision[]>{
    console.log('search workEffortRevision list with workEffortTypeId='+ workEffortTypeId);
    return this.client
    .get(`work-effort-revision/${workEffortTypeId}`).pipe(
      map(json => json.results as WorkEffortRevision[])
    );
  }
}

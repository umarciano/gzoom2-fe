import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from './client.service';

import { WorkEffortType } from '../view/report-print/report';

@Injectable()
export class WorkEffortTypeService {

  constructor(private client: ApiClientService) { }

  workEffortTypes(workEffortTypeId: string): Observable<WorkEffortType[]> {
    console.log('search workEffortType list with workEffortTypeId='+ workEffortTypeId);
    return this.client
      .get(`work-effort-type/like/${workEffortTypeId}`).pipe(
        map(json => json.results as WorkEffortType[])
      );
  }
}

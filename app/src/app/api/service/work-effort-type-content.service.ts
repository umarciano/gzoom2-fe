import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from '../../commons/service/client.service';

@Injectable()
export class WorkEffortTypeContentService {

  constructor(private client: ApiClientService) { }

  workEffortTypeContentParams(workEffortTypeId: string, contentId: string): Observable<any> {
    return this.client
      .get(`workEffortTypeContentParams?workEffortTypeId=${workEffortTypeId}&contentId=${contentId}`).pipe(
        map(json => {return json;})
      );
  }
}

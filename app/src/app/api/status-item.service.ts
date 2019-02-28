import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from './client.service';

import { StatusItem } from '../view/status-item/status-item/status-item';


@Injectable()
export class StatusItemService {

  constructor(private client: ApiClientService) { }

  statusItems(parentTypeId: string): Observable<StatusItem[]> {
    console.log('search statusItem with '+ parentTypeId);
    return this.client
      .get(`status-items/${parentTypeId}`).pipe(
        map(json => json.results as StatusItem[])
      );
  }

}

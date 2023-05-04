import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from 'app/commons/service/client.service';
import { Enumeration } from '../model/enumeration';

@Injectable()
export class EnumerationService {
  constructor(private client: ApiClientService) {}

  enumerations(enumTypeId: string): Observable<Enumeration[]> {
    return this.client
    .get(`enumeration/${enumTypeId}`).pipe(
      map(json => json.results as Enumeration[])
    );
  }
}

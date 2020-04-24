import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http'


import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from 'app/api/client.service';
import { Enumeration } from './enumeration';

@Injectable()
export class EnumerationService {
  constructor(private client: ApiClientService) {}

  enumerations(enumTypeId: string): Observable<Enumeration[]> {
    console.log('search enumeration');
    return this.client
    .get(`enumeration/${enumTypeId}`).pipe(
      map(json => json.results as Enumeration[])
    );
  }
}

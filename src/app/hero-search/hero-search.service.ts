import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import { ApiClientService } from '../api/client.service';
import { Hero } from '../hero';

@Injectable()
export class HeroSearchService {

  constructor(private client: ApiClientService) { }

  search(term: string): Observable<Hero[]> {
    const params = new URLSearchParams();
    params.append('name', term);

    return this.client
      .get('heroes', {search: params})
      .map(json => json.results as Hero[]);
  }

}

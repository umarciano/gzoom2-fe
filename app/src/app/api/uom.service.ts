import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import { ApiClientService } from './client.service';
import { UomType } from '../view/uom/uom-type/uom_type';

@Injectable()
export class UomService {

  constructor(private client: ApiClientService) { }

  search(): Observable<UomType[]> {
    console.log('search');
    return this.client
      .get('uom/types')
      .map(json => json.results as UomType[]);
  }

}

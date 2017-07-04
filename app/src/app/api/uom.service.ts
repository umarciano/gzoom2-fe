import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import { ApiClientService } from './client.service';
import { UomType } from '../view/uom/uom-type/uom_type';
import { Uom } from '../view/uom/uom/uom';

@Injectable()
export class UomService {

  constructor(private client: ApiClientService) { }

  uomType(): Observable<UomType[]> {
    console.log('search uomType');
    return this.client
      .get('uom/types')
      .map(json => json.results as UomType[]);
  }

  createUomType(uomType: UomType):  Promise<UomType> {
    console.log('create UomType');
    return this.client
      .post('uom/types', JSON.stringify(uomType))
      .toPromise()
      .then(response => response)
      .catch(response => {
        console.error(`Error while creating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  updateUomType(uomTypeId: string, uomType: UomType):  Promise<UomType> {
    console.log('update UomType');
    return this.client
      .put(`uom/types/${uomTypeId}`, JSON.stringify(uomType))
      .toPromise()
      .then(response => response)
      .catch((response: any) => {
        console.error(`Error while updating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  deleteUomType(uomTypeId: string):  Promise<UomType> {
    console.log('delete UomType with ' + uomTypeId);
    return this.client
      .delete(`uom/types/${uomTypeId}`)
      .toPromise()
      .then(response => response)
      .catch((response: any) => {
        console.error(`Error while deleting in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  uom(): Observable<Uom[]> {
    console.log('search uom');
    return this.client
      .get('uom/values')
      .map(json => json.results as Uom[]);
  }

}

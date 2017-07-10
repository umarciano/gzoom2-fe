import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import { ApiClientService } from './client.service';
import { UomType } from '../view/uom/uom-type/uom_type';
import { Uom } from '../view/uom/uom/uom';
import { UomRatingScale } from '../view/uom/scale/uom_rating_scale';

@Injectable()
export class UomService {

  constructor(private client: ApiClientService) { }

  uomTypes(): Observable<UomType[]> {
    console.log('search uomType');
    return this.client
      .get('uom/type')
      .map(json => json.results as UomType[]);
  }

  createUomType(uomType: UomType):  Promise<UomType> {
    console.log('create UomType');
    return this.client
      .post('uom/type', JSON.stringify(uomType))
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
      .put(`uom/type/${uomTypeId}`, JSON.stringify(uomType))
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
      .delete(`uom/type/${uomTypeId}`)
      .toPromise()
      .then(response => response)
      .catch((response: any) => {
        console.error(`Error while deleting in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  uoms(): Observable<Uom[]> {
    console.log('search uom');
    return this.client
      .get('uom/value')
      .map(json => json.results as Uom[]);
  }

  uom(uomId: string): Observable<Uom> {
    console.log('search uom with ' + uomId);
    return this.client
      .get(`uom/value/${uomId}`)
      .map(json => json.uom as Uom);
  }

  createUom(uom: Uom):  Promise<Uom> {
    console.log('create Uom');
    return this.client
      .post('uom/value', JSON.stringify(uom))
      .toPromise()
      .then(response => response)
      .catch(response => {
        console.error(`Error while creating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  updateUom(uomId: string, uom: Uom):  Promise<Uom> {
    console.log('update Uom');
    return this.client
      .put(`uom/value/${uomId}`, JSON.stringify(uom))
      .toPromise()
      .then(response => response)
      .catch((response: any) => {
        console.error(`Error while updating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  deleteUom(uomId: string):  Promise<Uom> {
    console.log('delete Uom with ' + uomId);
    return this.client
      .delete(`uom/value/${uomId}`)
      .toPromise()
      .then(response => response)
      .catch((response: any) => {
        console.error(`Error while deleting in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  uomRatingScales(uomId: string): Observable<UomRatingScale[]> {
    console.log('search uomRatingScale');
    return this.client
      .get(`uom/scale/${uomId}`)
      .map(json => json.results as UomRatingScale[]);
  }

  createUomRatingScale(uomRatingScale: UomRatingScale):  Promise<UomRatingScale> {
    console.log('create UomRatingScale');
    return this.client
      .post('uom/scale', JSON.stringify(uomRatingScale))
      .toPromise()
      .then(response => response)
      .catch(response => {
        console.error(`Error while creating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  updateUomRatingScale(uomId: string, uomRatingValue:number, uomRatingScale: UomRatingScale):  Promise<UomRatingScale> {
    console.log('update UomRatingScale');
    return this.client
      .put(`uom/scale/${uomId}/${uomRatingValue}`, JSON.stringify(uomRatingScale))
      .toPromise()
      .then(response => response)
      .catch((response: any) => {
        console.error(`Error while updating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  deleteUomRatingScale(uomId: string, uomRatingValue:number):  Promise<UomRatingScale> {
    console.log('delete UomRatingScale with ' + uomId);
    return this.client
      .delete(`uom/scale/${uomId}/${uomRatingValue}`)
      .toPromise()
      .then(response => response)
      .catch((response: any) => {
        console.error(`Error while deleting in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

}

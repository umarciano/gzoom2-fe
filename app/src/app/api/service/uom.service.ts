import { Injectable } from '@angular/core';

import { lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from '../../commons/service/client.service';

import { UomType } from '../../view/ctx-ba/uom/uom-type/uom_type';
import { Uom } from '../../view/ctx-ba/uom/uom/uom';
import { UomRangeValues } from '../../view/ctx-ba/uom/range-values/uom-range-values';
import { UomRatingScale } from '../../view/ctx-ba/uom/scale/uom_rating_scale';
import { HttpErrorResponse } from '@angular/common/http';
import { forEach } from 'lodash';

@Injectable()
export class UomService {

  constructor(private client: ApiClientService) { }

  uomTypes(): Observable<UomType[]> {
    return this.client
      .get('uom/type').pipe(
        map(json => json.results as UomType[])
      );
  }

  createUomType(uomType: UomType):  Promise<UomType> {
    console.log('create UomType');
    const client$ = this.client.post('uom/type', JSON.stringify(uomType));
    return lastValueFrom(client$).then(response => response)
    .catch(error => {
      console.error(`Error while creating in: ${error.error.message}`);
      return Promise.reject( error.error);
    });
  }

  updateUomType(uomTypeId: string, uomType: UomType):  Promise<UomType> {
    console.log('update UomType');

    const client$ = this.client.put(`uom/type/${uomTypeId}`, JSON.stringify(uomType));
    return lastValueFrom(client$).then(response => response)
    .catch((error: any) => {
      console.error(`Error while updating in: ${error.error.message}`);
      return Promise.reject( error.error);
    });
  }

  deleteUomType(uomTypeId: string):  Promise<UomType> {
    console.log('delete UomType with ' + uomTypeId);
    const client$ = this.client.delete(`uom/type/${uomTypeId}`);
    return lastValueFrom(client$).then(response => response)
    .catch((error: any) => {
      console.error(`Error while deleting in: ${error.error.message}`);
      return Promise.reject( error.error);
    });
  }

  uoms(): Observable<Uom[]> {
    return this.client
      .get('uom/value').pipe(
        map(json => json.results as Uom[])
      );
  }

  uom(uomId: string): Observable<Uom> {
    console.log('search uom with ' + uomId);
    return this.client
      .get(`uom/value/${uomId}`).pipe(
        map(json => json as Uom)
      );
  }

  /**
   * "1.2-2"
   */
  formatNumber(uom: Uom): String{
    var format = "1.";
    if (uom.decimalScale != null) {
      format += uom.decimalScale + "-" + uom.decimalScale;
    } else format += "0-0";
    console.log("- fomar="+ format);
    return format;
  }

  patternRegExp(uom: Uom): String{
    var format = "^[0-9]+(.[0-9]{0,@})?$";
    if (uom.decimalScale == null) {
      format = format.replace('@', '0');
    } else format = format.replace('@', String(uom.decimalScale));
    console.log("- pattern="+ format);
    return format;
  }



  createUom(uom: Uom): Promise<Uom>{
    console.log('create Uom');

    const client$ = this.client.post(`uom/value/`,JSON.stringify(uom))
    
    return lastValueFrom(client$).then(response => response)
    .catch((response: HttpErrorResponse ) => {
      console.error(`Error while creating in: ${response}`);
      return Promise.reject(response);
    });
  }

  updateUom(uomId: string, uom: Uom):  Promise<Uom> {
    console.log('update Uom');

    const client$ = this.client.put(`uom/value/${uomId}`, JSON.stringify(uom));
    return lastValueFrom(client$).then(response => response)
    .catch((response: any) => {
      console.error(`Error while updating in: ${response}`);
      return Promise.reject(response);
    });
  }

  deleteUom(uomId: string):  Promise<Uom> {
    console.log('delete Uom with ' + uomId);

    const client$ = this.client.delete(`uom/value/${uomId}`);
    return lastValueFrom(client$).then(response => response)
    .catch((error: HttpErrorResponse ) => {
      console.error(`Error while exec query: ${error.error.message}`);
      return Promise.reject(error.error.message);
    });
  }

  uomRatingScales(uomId: string): Observable<UomRatingScale[]> {
    return this.client
      .get(`uom/scale/${uomId}`).pipe(
        map(json => json.results as UomRatingScale[])
      );
  }

  createUomRatingScale(uomRatingScale: UomRatingScale):  Promise<UomRatingScale> {
    console.log('create UomRatingScale');

    const client$ = this.client.post('uom/scale', JSON.stringify(uomRatingScale))
    return lastValueFrom(client$).then(response => response)
    .catch(response => {
      console.error(`Error while creating in: ${response}`);
      return Promise.reject(response);
    });
  }

  updateUomRatingScale(uomRatingScale: UomRatingScale):  Promise<UomRatingScale> {
    console.log('update UomRatingScale');

    const client$ = this.client.put(`uom/scale/${uomRatingScale.uomId}/${uomRatingScale.uomRatingValue}`, JSON.stringify(uomRatingScale));
    return lastValueFrom(client$).then(response => response)
    .catch((response: any) => {
      console.error(`Error while updating in: ${response}`);
      return Promise.reject(response);
    });
  }

  deleteUomRatingScale(uomId: string, uomRatingValue:number):  Promise<UomRatingScale> {
    console.log('delete UomRatingScale with ' + uomId);

    const client$ = this.client.delete(`uom/scale/${uomId}/${uomRatingValue}`);
    return lastValueFrom(client$).then(response => response)
    .catch((error: HttpErrorResponse ) => {
      console.error(`Error while exec query: ${error.error.message}`);
      return Promise.reject(error.error.message);
    });
  }

  /**
   * uomRangeValues
   */
  uomRangeValues(uomRangeId: string): Observable<UomRangeValues[]> {
    return this.client
      .get(`uom-range-values/${uomRangeId}`).pipe(
        map(json => json.results as UomRangeValues[])
      );
  }
}

import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from 'app/commons/service/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlFiscalType } from '../model/glFiscalType'
import { GlFiscalTypeEx } from '../model/glFiscalTypeEx';




@Injectable()
export class GlFiscalTypeService {

  constructor(private client: ApiClientService) { }

  /**
   * Gets the list of gl_fiscal_type.
   * 
   * @returns Observable<GlFiscalType[]>
   */
  getGlFiscalType(): Observable<GlFiscalType[]> {
    return this.client
      .get(`gl-fiscal-type/`).pipe(
        map(json => json.results as GlFiscalType[])
      );
  }

  /**
   * Gets the list of gl_fiscal_type.
   * 
   * @returns Observable<GlFiscalTypeEx[]>
   */
  getDetectionType(): Observable<GlFiscalTypeEx[]> {
    return this.client
      .get(`gl-fiscal-type/detection-type`).pipe(
        map(json => json.results as GlFiscalTypeEx[])
      );
  }

  /**
   * Create a gl_fiscal_type.
   * 
   * @param glFiscalType - GlFiscalType
   * @returns Promise<GlFiscalType>
   */
  async createGlFiscalType(glFiscalType: GlFiscalType): Promise<GlFiscalType> {
    console.log(glFiscalType)
    const client$ = this.client.post(`gl-fiscal-type/`, JSON.stringify(glFiscalType));
    return await lastValueFrom(client$).then(response => response)
      .catch((response: HttpErrorResponse) => {
        console.error(`Error while creating in: ${response.error.message}`);
        return Promise.reject(response.error.message);
      });
  };

  /**
   * Update a gl_fiscal_type.
   * 
   * @param glFiscalType - GlFiscalType
   * @returns Promise<GlFiscalType>
   */
  updateGlFiscalType(glFiscalType: GlFiscalType): Promise<GlFiscalType> {
    console.log(glFiscalType)
    const client$ = this.client.put('gl-fiscal-type/', JSON.stringify(glFiscalType));
    return lastValueFrom(client$).then(response => response)
      .catch((response: HttpErrorResponse) => {
        console.error(`Error while updating in: ${response.error.message}`);
        return Promise.reject(response.error.message)

      })

  };

  /**
   * Delete the gl_fiscal_type ids passed to it.
   * 
   * @param id - string
   * @returns Promise
   */
  deleteGlFiscalType(id: string): Promise<any> {
    const client$ = this.client.delete(`gl-fiscal-type/${id}`);
    return lastValueFrom(client$).then(response => response)
      .catch((error: any) => {
        console.error(`Error while deleting in: ${error.error.message}`);
        return Promise.reject(error.error);
      });

  }

}

import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from 'app/commons/service/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataSourceType } from '../model/dataSourceType'




@Injectable()
export class DataSourceTypeService {

  constructor(private client: ApiClientService) { }

  /**
   * Gets the list of data_source_type.
   * 
   * @returns Observable<DataSourceType[]>
   */
  getDataSourceType(): Observable<DataSourceType[]> {
    return this.client
      .get(`data-source-type/`).pipe(
        map(json => json.results as DataSourceType[])
      );
  }

  /**
   * Update a data_source_type.
   * 
   * @param DataSourceType - DataSourceType
   * @returns Promise<DataSourceType>
   */
  async createDataSourceType(DataSourceType: DataSourceType): Promise<DataSourceType> {
    const client$ = this.client.post(`data-source-type/`, JSON.stringify(DataSourceType));
    return await lastValueFrom(client$).then(response => response)
    .catch((response: HttpErrorResponse ) => {
      console.error(`Error while creating in: ${response.error.message}`);
      return Promise.reject(response.error.message);
    });
  };

  /**
   * Update a data_source_type.
   * 
   * @param DataSourceType - DataSourceType
   * @returns Promise<DataSourceType>
   */
  updateDataSourceType(DataSourceType: DataSourceType): Promise<DataSourceType> {
    const client$ = this.client.put('data-source-type/', JSON.stringify(DataSourceType));
    return lastValueFrom(client$).then(response => response)
    .catch((response: HttpErrorResponse) => {
      console.error(`Error while updating in: ${response.error.message}`);
      return Promise.reject(response.error.message)

    })

  };

  /**
   * Delete the data_source_type ids passed to it.
   * 
   * @param id - string
   * @returns Promise
   */
  deleteDataSourceType(id: string): Promise<any>{
    const client$ = this.client.delete(`data-source-type/${id}`);
    return lastValueFrom(client$).then(response => response)
    .catch((error: any) => {
      console.error(`Error while deleting in: ${error.error.message}`);
        return Promise.reject(error.error);
    });

  }

}

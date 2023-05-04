import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from 'app/commons/service/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataResourceType } from '../model/dataResourceType'




@Injectable()
export class DataResourceTypeService {

  constructor(private client: ApiClientService) { }

  /**
   * Gets the list of data_resource_type.
   * 
   * @returns Observable<DataResourceType[]>
   */
  getDataResourceType(): Observable<DataResourceType[]> {
    return this.client
      .get(`data-resource-type/`).pipe(
        map(json => json.results as DataResourceType[])
      );
  }

  /**
   * Update a data_resource_type.
   * 
   * @param DataResourceType - DataResourceType
   * @returns Promise<DataResourceType>
   */
  async createDataResourceType(DataResourceType: DataResourceType): Promise<DataResourceType> {
    const client$ = this.client.post(`data-resource-type/`, JSON.stringify(DataResourceType));
    return await lastValueFrom(client$).then(response => response)
    .catch((response: HttpErrorResponse ) => {
      console.error(`Error while creating in: ${response.error.message}`);
      return Promise.reject(response.error.message);
    });
  };

  /**
   * Update a data_resource_type.
   * 
   * @param DataResourceType - DataResourceType
   * @returns Promise<DataResourceType>
   */
  updateDataResourceType(DataResourceType: DataResourceType): Promise<DataResourceType> {
    const client$ = this.client.put('data-resource-type/', JSON.stringify(DataResourceType));
    return lastValueFrom(client$).then(response => response)
    .catch((response: HttpErrorResponse) => {
      console.error(`Error while updating in: ${response.error.message}`);
      return Promise.reject(response.error.message)

    })

  };

  /**
   * Delete the data_resource_type ids passed to it.
   * 
   * @param id - string
   * @returns Promise
   */
  deleteDataResourceType(id: string): Promise<any>{
    const client$ = this.client.delete(`data-resource-type/${id}`);
    return lastValueFrom(client$).then(response => response)
    .catch((error: any) => {
      console.error(`Error while deleting in: ${error.error.message}`);
        return Promise.reject(error.error);
    });

  }

}

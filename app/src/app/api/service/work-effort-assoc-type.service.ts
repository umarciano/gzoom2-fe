import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from 'app/commons/service/client.service';
import { WorkEffortAssocType } from '../model/workEffortAssocType';
import { HttpErrorResponse } from '@angular/common/http';




@Injectable()
export class WorkEffortAssocTypeService {

  constructor(private client: ApiClientService) { }

  /**
   * Gets the list of work_effort_assoc_type.
   * 
   * @returns Observable<WorkEffortAssocType[]>
   */
  getWorkEffortAssocType(): Observable<WorkEffortAssocType[]> {
    return this.client
      .get(`work-effort-assoc-type/`).pipe(
        map(json => json.results as WorkEffortAssocType[])
      );
  }

  /**
   * Update a work_effort_assoc_type.
   * 
   * @param workEffortAssocType - WorkEffortAssocType
   * @returns Promise<WorkEffortAssocType>
   */
  async createWorkEffortAssocType(workEffortAssocType: WorkEffortAssocType): Promise<WorkEffortAssocType> {
    const client$ = this.client.post(`work-effort-assoc-type/`, JSON.stringify(workEffortAssocType));
    return await lastValueFrom(client$).then(response => response)
    .catch((response: HttpErrorResponse ) => {
      console.error(`Error while creating in: ${response.error.message}`);
      return Promise.reject(response.error.message);
    });
  };

  /**
   * Update a work_effort_assoc_type.
   * 
   * @param workEffortAssocType - WorkEffortAssocType
   * @returns Promise<WorkEffortAssocType>
   */
  updateWorkEffortAssocType(workEffortAssocType: WorkEffortAssocType): Promise<WorkEffortAssocType> {
    const client$ = this.client.put('work-effort-assoc-type/', JSON.stringify(workEffortAssocType));
    return lastValueFrom(client$).then(response => response)
    .catch((response: HttpErrorResponse) => {
      console.error(`Error while updating in: ${response.error.message}`);
      return Promise.reject(response.error.message)

    })

  };

  /**
   * Delete the work_effort_assoc_type ids passed to it.
   * 
   * @param id - string[]
   * @returns Promise
   */
  deleteWorkEffortAssocType(id: string[]): Promise<any>{
    const client$ = this.client.delete(`work-effort-assoc-type/${id}`);
    return lastValueFrom(client$).then(response => response)
    .catch((error: any) => {
      console.error(`Error while deleting in: ${error.error.message}`);
        return Promise.reject(error.error);
    });

  }

}

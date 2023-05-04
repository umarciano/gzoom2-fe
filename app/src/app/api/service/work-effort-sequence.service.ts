import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from 'app/commons/service/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkEffortSequence } from '../model/workEffortSequence'




@Injectable()
export class WorkEffortSequenceService {

  constructor(private client: ApiClientService) { }

  /**
   * Gets the list of work_effort_sequence.
   * 
   * @returns Observable<WorkEffortSequence[]>
   */
  getWorkEffortSequence(): Observable<WorkEffortSequence[]> {
    return this.client
      .get(`work-effort-sequence/`).pipe(
        map(json => json.results as WorkEffortSequence[])
      );
  }

  /**
   * Update a work_effort_sequence.
   * 
   * @param workEffortSequence - WorkEffortSequence
   * @returns Promise<WorkEffortSequence>
   */
  async createWorkEffortSequence(workEffortSequence: WorkEffortSequence): Promise<WorkEffortSequence> {
    const client$ = this.client.post(`work-effort-sequence/`, JSON.stringify(workEffortSequence));
    return await lastValueFrom(client$).then(response => response)
    .catch((response: HttpErrorResponse ) => {
      console.error(`Error while creating in: ${response.error.message}`);
      return Promise.reject(response.error.message);
    });
  };

  /**
   * Update a work_effort_sequence.
   * 
   * @param workEffortSequence - WorkEffortSequence
   * @returns Promise<WorkEffortSequence>
   */
  updateWorkEffortSequence(workEffortSequence: WorkEffortSequence): Promise<WorkEffortSequence> {
    const client$ = this.client.put('work-effort-sequence/', JSON.stringify(workEffortSequence));
    return lastValueFrom(client$).then(response => response)
    .catch((response: HttpErrorResponse) => {
      console.error(`Error while updating in: ${response.error.message}`);
      return Promise.reject(response.error.message)

    })

  };

  /**
   * Delete the work_effort_sequence ids passed to it.
   * 
   * @param id - string
   * @returns Promise
   */
  deleteWorkEffortSequence(id: string): Promise<any>{
    const client$ = this.client.delete(`work-effort-sequence/${id}`);
    return lastValueFrom(client$).then(response => response)
    .catch((error: any) => {
      console.error(`Error while deleting in: ${error.error.message}`);
        return Promise.reject(error.error);
    });

  }

}

import { Injectable } from "@angular/core";
import { ApiClientService } from "app/commons/service/client.service";
import { PeriodType } from "app/api/model/period-type";
import { Observable, lastValueFrom, map } from "rxjs";

@Injectable()
export class PeriodTypeService {

  constructor(private client: ApiClientService) { }

  periodTypes(): Observable<PeriodType[]> {
    return this.client
      .get('periodType/').pipe(
        map(json => json.results as PeriodType[])
      );
  }

  updatePeriodTypes(periodTypes: PeriodType): Promise<PeriodType> {
    console.log('update periodTypes');
    const client$ = this.client.put('periodType/', periodTypes);
    return lastValueFrom(client$).then(response => response)
      .catch(response => {
        console.error(`Error while creating in: ${response}`);
        return Promise.reject(response.json() || response);
      });
  }

  deletePeriodType(periodTypes: String[]): Promise<PeriodType> {
    const client$ = this.client.delete(`periodType/${periodTypes}`);
    return lastValueFrom(client$).then(response => response)
      .catch((error: any) => {
        console.error(`Error while deleting in: ${error.error.message}`);
        return Promise.reject(error.error);
      });
  }


  createPeriodType(periodTypes: PeriodType): Promise<PeriodType> {
    console.log('create periodType');

    const client$ = this.client.post('periodType/', periodTypes);
    return lastValueFrom(client$).then(response => response)
      .catch(response => {
        console.error(`Error while creating in: ${response}`);
        return Promise.reject(response);
      });
  }
}
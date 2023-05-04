import { Injectable } from '@angular/core';

import { lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from 'app/commons/service/client.service';

import { UomRangeValues } from '../../view/ctx-ba/uom/range-values/uom-range-values';
import { HttpErrorResponse } from '@angular/common/http';
import { forEach } from 'lodash';

@Injectable()
export class UomRangeValuesService {
    constructor(private client: ApiClientService) { }


    /**
     * Gets the value of green, yellow and red for the gauge.
     * 
     * @param uomRangeId - rangeDafault from comments.
     * @returns Observable<UomRangeValues[]>
     */
    uomRangeValues(uomRangeId: string): Observable<UomRangeValues[]> {
        return this.client
            .get(`uom-range-values/${uomRangeId}`).pipe(
                map(json => json.results as UomRangeValues[])
            );
    }

    /**
     * Gets the maximum range value.
     * 
     * @param uomRangeId - rangeDafault from comments.
     * @returns Promise<number>
     */
    async uomRangeValuesMax(uomRangeId: string): Promise<number> {

        const client$ = this.client.get(`uom-range-values-max/${uomRangeId}`);
        return await lastValueFrom(client$).then(response => response.results[0])
        .catch((response: any) => {
            console.log(`Error: ${response}`);
            return Promise.reject(response.json() || response);

        })

        // return await this.client.get(`uom-range-values-max/${uomRangeId}`)
        //     .toPromise().then(response => response.results[0])
        //     .catch((response: any) => {
        //         console.log(`Error: ${response}`);
        //         return Promise.reject(response.json() || response);

        //     })
    }

    /**
     * Gets the minimum range value.
     * 
     * @param uomRangeId - rangeDafault from comments.
     * @returns Observable<number>
     */
    uomRangeValuesMin(uomRangeId: string): Observable<number> {

        return this.client
        .get(`uom-range-values-min/${uomRangeId}`).pipe(
            map(json => json as number)
        );
    }

    /**
     * Gets the emoticon path based on amount.
     * 
     * @param rangeDefault - rangeDafault from comments.
     * @param amount - Amount of work effort.
     * @returns Observable<UomRangeValues[]>
     */
    uomRangeValuesPathEmoticon(rangeDefault: string, amount: number): Observable<UomRangeValues[]> {
        console.log(`uom-range-values-path/${rangeDefault}/${amount}`);

        return this.client
            .get(`uom-range-values-path/${rangeDefault}/${amount}`).pipe(
                map(json => json.results as UomRangeValues[])
            );
    }
}
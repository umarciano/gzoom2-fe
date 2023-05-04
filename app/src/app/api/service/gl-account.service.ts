import { Injectable } from '@angular/core';

import { lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from 'app/commons/service/client.service';



@Injectable()
export class GlAccountService {
    constructor(private client: ApiClientService) { }

    /**
     * Gets decimal precision
     * 
     * @returns Promise<number>
     */
    getPrecisionDecimal(): Promise<number> {

        const client$ = this.client.get(`glaccount-precision`)
        return lastValueFrom(client$).catch((response: any) => {
            console.log(`Error: ${response}`);
            return Promise.reject(response.json() || response);
        })
        // return this.client.get(`glaccount-precision`)
        // .toPromise().then(response =>  response)
        // .catch((response: any) => {
        //     console.log(`Error: ${response}`);
        //     return Promise.reject(response.json() || response);
        // })
    }
}
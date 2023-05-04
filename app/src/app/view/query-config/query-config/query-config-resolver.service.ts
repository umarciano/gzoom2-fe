import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';


import { LockoutService } from '../../../commons/service/lockout.service';
import { QueryConfig } from './query-config';
import { QueryConfigService } from '../../../api/service/query-config.service';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class QueryConfigResolver implements Resolve<void | QueryConfig[]> {

  constructor(
    private readonly queryConfigService: QueryConfigService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | QueryConfig[]> {

    const parentTypeId = route.params.context;
    const queryType = route.params.id;

    console.log('resolve query cofig'+ parentTypeId+ queryType );

    const queryConfigService$ = this.queryConfigService.queryConfigs(parentTypeId, queryType);
    return lastValueFrom(queryConfigService$).then(queryConfigs => { return queryConfigs; })
    .catch(err => { 
      console.error('Cannot retrieve query config', err);
      this.lockoutService.lockout();
    });

    // return this.queryConfigService
    //   .queryConfigs(parentTypeId, queryType)
    //   .toPromise()
    //   .then(queryConfigs => { return queryConfigs; })
    //   .catch(err => { // TODO serve il lockout?
    //     console.error('Cannot retrieve query config', err);
    //     this.lockoutService.lockout();
    //   });
  }
}

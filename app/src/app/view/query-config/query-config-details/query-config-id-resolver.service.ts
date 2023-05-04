import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';


import { LockoutService } from '../../../commons/service/lockout.service';
import { QueryConfig } from '../query-config/query-config';
import { QueryConfigService } from '../../../api/service/query-config.service';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class QueryConfigIdResolver implements Resolve<void | QueryConfig> {

  constructor(
    private readonly queryConfigService: QueryConfigService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | QueryConfig> {
    console.log('resolve query cofig');
    const id = route.paramMap.get('id');
    console.log('resolver param id = ' + id);

    const queryConfigService$ = this.queryConfigService.getQueryConfig(id);
    return lastValueFrom(queryConfigService$).then(queryConfig => { console.log("resolver id "+queryConfig); return queryConfig; })
    .catch(err => { 
      console.error('Cannot retrieve query config', err);
      this.lockoutService.lockout();
    });


    // return this.queryConfigService
    //   .getQueryConfig(id)
    //   .toPromise()
    //   .then(queryConfig => { console.log("resolver id "+queryConfig); return queryConfig; })
    //   .catch(err => { // TODO serve il lockout?
    //     console.error('Cannot retrieve query config', err);
    //     this.lockoutService.lockout();
    //   });
  }
}

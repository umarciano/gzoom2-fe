import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';


import { LockoutService } from '../../../commons/lockout.service';
import { QueryConfig } from './query-config';
import { QueryConfigService } from '../../../api/query-config.service';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class QueryConfigResolver implements Resolve<void | QueryConfig[]> {

  constructor(
    private readonly queryConfigService: QueryConfigService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | QueryConfig[]> {
    console.log('resolve query cofig');

    return this.queryConfigService
      .queryConfigs()
      .toPromise()
      .then(queryConfigs => { return queryConfigs; })
      .catch(err => { // TODO serve il lockout?
        console.error('Cannot retrieve query config', err);
        this.lockoutService.lockout();
      });
  }
}

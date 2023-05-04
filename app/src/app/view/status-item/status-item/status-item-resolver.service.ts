import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';


import { LockoutService } from '../../../commons/service/lockout.service';
import { StatusItemService } from '../../../api/service/status-item.service';
import { StatusItem } from './status-item';


@Injectable()
export class StatusItemResolverService {

  constructor(
    private readonly statusItemService: StatusItemService,
    private readonly lockoutService: LockoutService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | StatusItem[]> {
    console.log('resolve Status Item');
    var parentTypeId = route.params.context;

    const statusItemService$ = this.statusItemService.statusItems(parentTypeId);
    return lastValueFrom(statusItemService$).then(statusItems => { return statusItems; })
    .catch(err => { 
      console.error('Cannot retrieve statusItem', err);
      this.lockoutService.lockout();
    });

    // return this.statusItemService
    //   .statusItems(parentTypeId)
    //   .toPromise()
    //   .then(statusItems => { return statusItems; })
    //   .catch(err => { 
    //     console.error('Cannot retrieve statusItem', err);
    //     this.lockoutService.lockout();
    //   });
  }

}

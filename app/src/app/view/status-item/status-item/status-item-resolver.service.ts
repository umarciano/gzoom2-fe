import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { LockoutService } from '../../../commons/lockout.service';
import { StatusItemService } from '../../../api/status-item.service';
import { StatusItem } from './status-item';


@Injectable()
export class StatusItemResolverService {

  constructor(
    private readonly statusItemService: StatusItemService,
    private readonly lockoutService: LockoutService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | StatusItem[]> {
    console.log('resolve Status Item');
    var parentTypeId = route.params.parentTypeId;
    return this.statusItemService
      .statusItems(parentTypeId)
      .toPromise()
      .then(statusItems => { return statusItems; })
      .catch(err => { 
        console.error('Cannot retrieve statusItem', err);
        this.lockoutService.lockout();
      });
  }

}

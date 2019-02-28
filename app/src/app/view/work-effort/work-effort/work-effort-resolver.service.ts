import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';


import { LockoutService } from '../../../commons/lockout.service';
import { WorkEffortService } from '../../../api/work-effort.service';
import { WorkEffort } from './work-effort';

@Injectable()
export class WorkEffortResolverService {

  constructor(
    private readonly workEffortService: WorkEffortService,
    private readonly lockoutService: LockoutService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | WorkEffort[]> {
    var parentTypeId = route.parent.params.parentTypeId;
    console.log('resolve workEffort parentTypeId='+parentTypeId);
    return this.workEffortService
      .workEfforts(parentTypeId, '_NA_', true)
      .toPromise()
      .then(workEfforts => { return workEfforts; })
      .catch(err => { 
        console.error('Cannot retrieve workEffort', err);
        this.lockoutService.lockout();
      });
  }

}

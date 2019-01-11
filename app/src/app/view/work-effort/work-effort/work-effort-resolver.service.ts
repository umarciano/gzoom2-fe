import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

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
    console.log('resolve workEffort');
    return this.workEffortService
      .workEfforts()
      .toPromise()
      .then(workEfforts => { return workEfforts; })
      .catch(err => { 
        console.error('Cannot retrieve workEffort', err);
        this.lockoutService.lockout();
      });
  }

}

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { LockoutService } from '../../../commons/lockout.service';
import { ReportService } from '../../../api/report.service';
import { Report } from '../../../report/report';
import { WorkEffort } from '../../../report/report';

import { DatePipe } from '@angular/common';

@Injectable()
export class ReportWorkefforttypeResolverService {

  constructor(
    private readonly reportService: ReportService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | WorkEffort[]> {
   //TODO
    var parentTypeId = String(route.parent.parent.url);
    console.log('resolve workefforttype for parentTypeId = ' + parentTypeId);

    var reportContentId = String(route.parent.url);
    console.log('resolve workefforttype for reportContentId = ' + reportContentId);

    var workEffortTypeId = route.paramMap.get('workEffortTypeId');
    console.log('resolve workefforttype for workEffortTypeId = ' + workEffortTypeId);

    return this.reportService
      .workEfforts(parentTypeId, reportContentId, workEffortTypeId) 
      .toPromise()
      .then(workEfforts => { return workEfforts; })
      .catch(err => {
        console.error('Cannot retrieve workeffort', err);
        this.lockoutService.lockout();
      });
  }

}

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';


import { LockoutService } from '../../../commons/service/lockout.service';


import { WorkEffortAnalysis } from '../../../api/model/workEffortAnalysis';
import { WorkEffortAnalysisService } from 'app/api/service/work-effort-analysis.service';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class TargetResolver implements Resolve<void | any[]> {

  constructor(
    private readonly WorkEffortService: WorkEffortAnalysisService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | any[]> {
    console.log('resolve Target');
    const context = route.paramMap.get('context');
    const analysisId = route.paramMap.get('analysisId');
    console.log('resolver param context = ' + context + ' analysisId = ' + analysisId);

    const WorkEffortService$ = this.WorkEffortService.getWorkEffortAnalysisTargetSummary(context, analysisId)
    return lastValueFrom(WorkEffortService$).then(Analyses => { return Analyses; })
    .catch(err => { // TODO serve il lockout?
      console.error('Cannot retrieve Analyses', err);
      this.lockoutService.lockout();
    });

    // return this.WorkEffortService
    //   .getWorkEffortAnalysisTargetSummary(context, analysisId)
    //   .toPromise()
    //   .then(Analyses => { return Analyses; })
    //   .catch(err => { // TODO serve il lockout?
    //     console.error('Cannot retrieve Analyses', err);
    //     this.lockoutService.lockout();
    //   });
  }
}

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';


import { LockoutService } from '../../commons/service/lockout.service';


import { WorkEffortAnalysis } from '../../api/model/workEffortAnalysis';
import { WorkEffortAnalysisService } from 'app/api/service/work-effort-analysis.service';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class AnalysisResolver implements Resolve<void | WorkEffortAnalysis[]> {

  constructor(
    private readonly WorkEffortAnalysisService: WorkEffortAnalysisService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | WorkEffortAnalysis[]> {
    console.log('resolve Analysis');
    const context = route.paramMap.get('context');
    console.log('resolver param context = ' + context);

    const WorkEffortAnalysisService$ = this.WorkEffortAnalysisService.getWorkEffortAnalysisWithContext(context)
    return lastValueFrom(WorkEffortAnalysisService$).then(Analyses => { return Analyses; })
    .catch(err => { // TODO serve il lockout?
      console.error('Cannot retrieve Analyses', err);
      this.lockoutService.lockout();
    });

  }
}

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';


import { LockoutService } from '../../../commons/service/lockout.service';
import { Report } from '../report';

import { DatePipe } from '@angular/common';
import { ReportService } from 'app/api/service/report.service';
/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class ReportPrintResolver implements Resolve<void | Report[]> {

  constructor(
    private readonly reportService: ReportService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | Report[]> {
    var parentTypeId = route.params.context;
    console.log('resolve reports');

    const reportService$ = this.reportService.reports(parentTypeId);
    return lastValueFrom(reportService$).then(reports => { return reports; })
    .catch(err => {
      console.error('Cannot retrieve report', err);
      this.lockoutService.lockout();
    });

    // return this.reportService
    //   .reports(parentTypeId)
    //   .toPromise()
    //   .then(reports => { return reports; })
    //   .catch(err => {
    //     console.error('Cannot retrieve report', err);
    //     this.lockoutService.lockout();
    //   });
  }
}

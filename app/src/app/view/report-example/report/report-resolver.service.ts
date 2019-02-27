import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { LockoutService } from '../../../commons/lockout.service';
import { ReportService } from '../../../api/report.service';
import { Report } from '../report';

import { DatePipe } from '@angular/common';
/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class ReportResolver implements Resolve<void | Report> {

  constructor(
    private readonly reportService: ReportService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | Report> {
    var parentTypeId = route.parent.params.parentTypeId;
    var reportContentId = route.params.reportContentId;
    var reportName = route.params.reportName;
    var analysis = route.params.analysis;
    console.log('resolve report for ' + parentTypeId + 'reportContentId=' + reportContentId + ' reportName='+reportName+ ' analysis='+analysis);
    //TODO come faccio?
    return this.reportService
      .report(parentTypeId, reportContentId, reportName, analysis)
      .toPromise()
      .then(report => { return report; })
      .catch(err => {
        console.error('Cannot retrieve report', err);
        this.lockoutService.lockout();
      });
  }
}

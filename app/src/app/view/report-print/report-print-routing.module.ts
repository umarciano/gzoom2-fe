import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { ReportPrintResolver } from './report-print/report-print-resolver.service';
import { ReportResolver } from './report/report-resolver.service';
import { ReportPrintComponent } from './report-print/report-print.component';
import { ReportComponent } from './report/report.component';

import { OrgUnitResolver } from '../party/party/org-unit-resolver.service';
import { UomResolver } from '../ctx-ba/uom/uom/uom-resolver.service';
import { StatusItemResolverService } from '../status-item/status-item/status-item-resolver.service';
import { RoleTypeResolverService } from '../role-type/role-type/role-type-resolver.service';
import { WorkEffortResolverService } from '../work-effort/work-effort/work-effort-resolver.service';

const routes: Routes = [
  {
    path: '', component: ReportPrintComponent, resolve: { reports: ReportPrintResolver },
    children: [
      {
        path: ':reportContentId/:resourceName/:workEffortTypeId/:analysis',
        component: ReportComponent, 
        resolve: {
          report: ReportResolver,
          orgUnits: OrgUnitResolver,
          statusItems: StatusItemResolverService,
          roleTypes: RoleTypeResolverService,
          //workEfforts: WorkEffortResolverService
        }
        //  children: [
        //    { path: ':workEffortTypeId', component: ReportWorkefforttypeComponent, resolve: { workEfforts: ReportWorkefforttypeResolverService }}
        //  ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportPrintRoutingModule { }

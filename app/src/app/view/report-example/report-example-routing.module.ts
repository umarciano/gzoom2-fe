import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { ReportExampleResolver } from './report-example/report-example-resolver.service';
import { ReportResolver } from '../../report/report/report-resolver.service';
import { ReportExampleComponent } from './report-example/report-example.component';
import { ReportComponent } from '../../report/report/report.component';
import { ReportDownloadComponent } from '../../report/report-download/report-download.component';
import { ReportWorkefforttypeResolverService } from '../../report/report/report-workefforttype/report-workefforttype-resolver.service';
import { ReportWorkefforttypeComponent } from '../../report/report/report-workefforttype/report-workefforttype.component';

import { OrgUnitResolver } from '../party/party/org-unit-resolver.service';
import { UomResolver } from '../uom/uom/uom-resolver.service';
import { StatusItemResolverService } from '../status-item/status-item/status-item-resolver.service';

const routes: Routes = [
  { path: 'report-download/:activityId', component: ReportDownloadComponent},
  { path: ':parentTypeId', component: ReportExampleComponent, resolve: { reports: ReportExampleResolver},
    children: [
      { path: ':reportContentId', component: ReportComponent, resolve: { report: ReportResolver,  
                                                                         orgUnits: OrgUnitResolver,
                                                                         statusItems: StatusItemResolverService },
      children: [
        { path: ':workEffortTypeId', component: ReportWorkefforttypeComponent, resolve: { workEfforts: ReportWorkefforttypeResolverService }}
      ]}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportExampleRoutingModule { }

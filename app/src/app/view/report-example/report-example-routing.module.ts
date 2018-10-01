import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { ReportExampleResolver } from './report-example/report-example-resolver.service';
import { ReportResolver } from '../../report/report/report-resolver.service';
import { ReportExampleComponent } from './report-example/report-example.component';
import { ReportComponent } from '../../report/report/report.component';
import { ReportDownloadComponent } from '../../report/report-download/report-download.component';

import { PartyResolver } from '../party/party/party-resolver.service';
import { UomResolver } from '../uom/uom/uom-resolver.service';

const routes: Routes = [
  { path: 'report-download/:contentId', component: ReportDownloadComponent},
  { path: ':parentTypeId', component: ReportExampleComponent, resolve: { reports: ReportExampleResolver},
    children: [
      { path: ':reportContentId', component: ReportComponent, resolve: { report: ReportResolver}}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportExampleRoutingModule { }

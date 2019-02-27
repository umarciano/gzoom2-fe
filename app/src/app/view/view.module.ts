import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutModule } from '../layout/layout.module';
import { ViewRoutingModule } from './view-routing.module';

import { ReportDownloadComponent } from '../layout/report-download/report-download.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    ViewRoutingModule
  ],
  declarations: [],
  providers: [
    ReportDownloadComponent
  ]
})
export class ViewModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutModule } from '../layout/layout.module';
import { ViewRoutingModule } from './view-routing.module';

import { ReportDownloadComponent } from '../shared/report-download/report-download.component';
import { ChangePasswordComponent } from '../shared/change-password/change-password.component';
import { SsoCallbackComponent } from './sso-callback/sso-callback.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    ViewRoutingModule
  ],
  declarations: [
    SsoCallbackComponent
  ],
  exports: [
  ],
  providers: [
    ReportDownloadComponent, ChangePasswordComponent
  ]
})
export class ViewModule { }

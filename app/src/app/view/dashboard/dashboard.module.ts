import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonsModule } from '../../commons/commons.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { I18nModule } from 'app/i18n/i18n.module';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    DashboardRoutingModule,
    I18nModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }

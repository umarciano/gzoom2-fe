import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonsModule } from '../../commons/commons.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    DashboardRoutingModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutModule } from '../layout/layout.module';
import { ViewRoutingModule } from './view-routing.module';


@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    ViewRoutingModule
  ],
  declarations: []
})
export class ViewModule { }

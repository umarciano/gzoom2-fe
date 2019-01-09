import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonsModule } from '../commons/commons.module';
import { LayoutModule } from '../layout/layout.module';
import { ViewRoutingModule } from './view-routing.module';


@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    LayoutModule,
    ViewRoutingModule
  ],
  declarations: []
})
export class ViewModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LayoutModule } from '../../layout/layout.module';
import { UomRoutingModule } from './uom-routing.module';

import { UomTypeComponent } from './uom-type/uom-type.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonsModule,
    ApiModule,
    LayoutModule,
    UomRoutingModule
  ],
  declarations: [
    UomTypeComponent
  ]
})
export class UomModule { }

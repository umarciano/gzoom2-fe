import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../../layout/layout.module';
import { ctx_baRoutingModule } from './ctx_ba-routing.module';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    ctx_baRoutingModule
  ],
  declarations: [],
  exports: [
  ],
  providers: []
})
export class CTX_BAModule { }

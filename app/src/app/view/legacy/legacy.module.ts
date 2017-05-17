import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { SharedModule } from '../../shared/shared.module';
import { LegacyRoutingModule } from './legacy-routing.module';
import { LegacyComponent } from './legacy.component';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    ApiModule,
    SharedModule,
    LegacyRoutingModule
  ],
  declarations: [LegacyComponent]
})
export class LegacyModule { }

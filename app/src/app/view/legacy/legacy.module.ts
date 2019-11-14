import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { SharedModule } from '../../shared/shared.module';
import { LegacyRoutingModule } from './legacy-routing.module';
import { LegacyComponent } from './legacy.component';

import { I18nModule } from 'app/i18n/i18n.module';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    ApiModule,
    SharedModule,
    LegacyRoutingModule,
    I18nModule
  ],
  declarations: [LegacyComponent]
})
export class LegacyModule { }

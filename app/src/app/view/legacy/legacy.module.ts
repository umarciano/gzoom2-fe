import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { SharedModule } from '../../shared/shared.module';
import { LegacyRoutingModule } from './legacy-routing.module';
import { LegacyComponent } from './legacy.component';
import {DialogModule} from 'primeng/dialog';
import { I18nModule } from 'app/i18n/i18n.module';
import {ButtonModule} from 'primeng/button';
import { ReportpopupComponent } from 'app/shared/report-popup/report-popup.component';
import {RadioButtonModule} from 'primeng/radiobutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    ApiModule,
    SharedModule,
    LegacyRoutingModule,
    DialogModule,
    I18nModule,
    ButtonModule,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    DropdownModule
  ],
  declarations: [LegacyComponent, ReportpopupComponent]
})
export class LegacyModule { }

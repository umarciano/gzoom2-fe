import { TreeTableModule } from 'primeng/treetable';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AccordionModule } from 'primeng/accordion';     //accordion and accordion tab
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { SharedModule,ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SpinnerModule } from 'primeng/spinner';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LayoutModule } from '../../layout/layout.module';

import { UomService } from '../../api/service/uom.service';

import { ReportPrintResolver } from './report-print/report-print-resolver.service';
import { ReportPrintRoutingModule } from './report-print-routing.module';
import { ReportPrintComponent } from './report-print/report-print.component';
import { ReportResolver } from './report/report-resolver.service';
import { ReportComponent } from './report/report.component';
import { PartyService } from 'app/api/service/party.service';
import { PartyResolver } from 'app/view/party/party/party-resolver.service';
import { OrgUnitResolver } from 'app/view/party/party/org-unit-resolver.service';
import { StatusItemService } from 'app/api/service/status-item.service';
import { StatusItemResolverService } from 'app/view/status-item/status-item/status-item-resolver.service';
import { RoleTypeService } from 'app/api/service/role-type.service';
import { RoleTypeResolverService } from 'app/view/role-type/role-type/role-type-resolver.service';
import { WorkEffortService } from 'app/api/service/work-effort.service';
import { WorkEffortResolverService } from 'app/view/work-effort/work-effort/work-effort-resolver.service';


import { I18nModule } from 'app/i18n/i18n.module';
import { CustomTimePeriodService } from 'app/commons/service/custom-time-period.service';
import { ReportService } from 'app/api/service/report.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CommonsModule,
    CalendarModule,
    ApiModule,
    LayoutModule,
    ReportPrintRoutingModule,
    AccordionModule,
    TreeTableModule,
    DialogModule,
    SharedModule,
    ButtonModule,
    ConfirmDialogModule,
    SpinnerModule,
    ToastModule,
    DropdownModule,
    RadioButtonModule,
    ListboxModule,
    InputSwitchModule,
    ToggleButtonModule,
    TooltipModule,
    MultiSelectModule,
    InputTextareaModule,
    I18nModule
  ],
  declarations: [
    ReportPrintComponent,
    ReportComponent
  ],
  providers: [
    ReportService,
    PartyService,
    StatusItemService,
    RoleTypeService,
    WorkEffortService,
    ConfirmationService,
    UomService,
    ReportPrintResolver,
    ReportResolver,
    PartyResolver,
    OrgUnitResolver,
    StatusItemResolverService,
    RoleTypeResolverService,
    WorkEffortResolverService,
    CustomTimePeriodService
  ]
})

export class ReportPrintModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AccordionModule } from 'primeng/primeng';     //accordion and accordion tab
import { DropdownModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService, SpinnerModule, CalendarModule, InputSwitchModule, ToggleButtonModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ListboxModule } from 'primeng/listbox';

import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LayoutModule } from '../../layout/layout.module';

import { ReportService } from '../../api/report.service';
import { UomService } from '../../api/uom.service';

import { ReportPrintResolver } from './report-print/report-print-resolver.service';
import { ReportPrintRoutingModule } from './report-print-routing.module';
import { ReportPrintComponent } from './report-print/report-print.component';
import { ReportResolver } from './report/report-resolver.service';
import { ReportComponent } from './report/report.component';
import { PartyService } from 'app/api/party.service';
import { PartyResolver } from 'app/view/party/party/party-resolver.service';
import { OrgUnitResolver } from 'app/view/party/party/org-unit-resolver.service';
import { StatusItemService } from 'app/api/status-item.service';
import { StatusItemResolverService } from 'app/view/status-item/status-item/status-item-resolver.service';
import { RoleTypeService } from 'app/api/role-type.service';
import { RoleTypeResolverService } from 'app/view/role-type/role-type/role-type-resolver.service';
import { WorkEffortService } from 'app/api/work-effort.service';
import { WorkEffortResolverService } from 'app/view/work-effort/work-effort/work-effort-resolver.service';


import { I18nModule } from 'app/i18n/i18n.module';

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
    DataTableModule,
    DialogModule,
    SharedModule,
    ButtonModule,
    ConfirmDialogModule,
    SpinnerModule,
    GrowlModule,
    DropdownModule,
    RadioButtonModule,
    ListboxModule,
    InputSwitchModule,
    ToggleButtonModule,
    TooltipModule,
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
    WorkEffortResolverService
  ]
})

export class ReportPrintModule { }

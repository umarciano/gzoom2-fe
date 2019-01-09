import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AccordionModule } from 'primeng/primeng';     //accordion and accordion tab
import { DropdownModule } from 'primeng/primeng';
import { MenuItem } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService, SpinnerModule, CalendarModule, InputSwitchModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/radiobutton';

import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LayoutModule } from '../../layout/layout.module';

import { ReportService } from '../../api/report.service';

import { ReportExampleResolver } from './report-example/report-example-resolver.service';
import { ReportExampleRoutingModule } from './report-example-routing.module';
import { ReportExampleComponent } from './report-example/report-example.component';
import { ReportResolver } from '../../report/report/report-resolver.service';
import { ReportWorkefforttypeResolverService } from '../../report/report/report-workefforttype/report-workefforttype-resolver.service';
import { ReportDownloadComponent } from '../../report/report-download/report-download.component';
import { ReportComponent } from '../../report/report/report.component';
import { ReportWorkefforttypeComponent } from '../../report/report/report-workefforttype/report-workefforttype.component';
import { PartyService } from 'app/api/party.service';
import { PartyResolver } from 'app/view/party/party/party-resolver.service';
import { OrgUnitResolver } from 'app/view/party/party/org-unit-resolver.service';
import { StatusItemService } from 'app/api/status-item.service';
import { StatusItemResolverService } from 'app/view/status-item/status-item/status-item-resolver.service';

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
    ReportExampleRoutingModule,
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
    InputSwitchModule,
    TooltipModule
  ],
  declarations: [
    ReportExampleComponent,
    ReportDownloadComponent,
    ReportComponent,
    ReportWorkefforttypeComponent
  ],
  providers: [
    ReportService,
    PartyService,
    StatusItemService,
    ConfirmationService,
    ReportExampleResolver,
    ReportResolver,
    ReportWorkefforttypeResolverService,
    PartyResolver,
    OrgUnitResolver,
    StatusItemResolverService
  ]
})

export class ReportExampleModule { }

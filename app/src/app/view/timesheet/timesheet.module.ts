import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccordionModule } from 'primeng/primeng';     //accordion and accordion tab
import { DropdownModule, AutoCompleteModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService, SpinnerModule, CalendarModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';

import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LayoutModule } from '../../layout/layout.module';

import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { TimesheetService } from '../../api/timesheet.service';
import { Timesheet } from './timesheet/timesheet';
import { TimesheetResolver } from './timesheet/timesheet-resolver.service';
import { WorkEffortResolver } from './time-entry/work-effort-resolver.service';
import { TimeEntryDetailComponent } from './time-entry/time-entry-detail.component';
import { TimeEntry } from './time-entry/time_entry';
import { TimeEntryResolver } from './time-entry/time-entry-resolver.service';

import {Party} from '../party/party/party';
import { PartyService } from '../../api/party.service';
import { PartyResolver } from '../party/party/party-resolver.service';

import { UomService } from '../../api/uom.service';
import { UomResolver } from '../uom/uom/uom-resolver.service';

import { NumberDecimalDirective } from './../../commons/number.directive';
import { NumberDecimalAccessor } from './../../commons/number.accessor';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonsModule,
    ApiModule,
    LayoutModule,
    AccordionModule,
    DataTableModule,
    DialogModule,
    SharedModule,
    ButtonModule,
    ConfirmDialogModule,
    SpinnerModule,
    CalendarModule,
    GrowlModule,
    DropdownModule,
    AutoCompleteModule,
    TooltipModule,
    TimesheetRoutingModule
  ],
  declarations: [
    TimesheetComponent,
    TimeEntryDetailComponent,
    NumberDecimalDirective,
    NumberDecimalAccessor
  ],
  providers: [
    TimesheetService,
    PartyService,
    UomService,
    TimesheetResolver,
    TimeEntryResolver,
    PartyResolver,
    UomResolver,
    WorkEffortResolver,
    ConfirmationService
  ]
})
export class TimesheetModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccordionModule } from 'primeng/primeng';     //accordion and accordion tab
import { DropdownModule } from 'primeng/primeng';
import { MenuItem } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService, SpinnerModule } from 'primeng/primeng';
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


@NgModule({
  imports: [
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
    GrowlModule,
    DropdownModule,
    TooltipModule,
    TimesheetRoutingModule
  ],
  declarations: [
    TimesheetComponent
  ],
  providers: [
    TimesheetService,
    TimesheetResolver,
    ConfirmationService
  ]
})
export class TimesheetModule { }

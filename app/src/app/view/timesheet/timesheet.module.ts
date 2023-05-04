import { TableModule } from 'primeng/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';     //accordion and accordion tab
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SharedModule, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { SpinnerModule } from 'primeng/spinner';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LayoutModule } from '../../layout/layout.module';
import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetComponent } from '../timesheet/timesheet/timesheet.component';
import { TimesheetService } from '../../api/service/timesheet.service';
import { Timesheet } from '../../api/model/timesheet';
import { TimesheetResolver } from './timesheet/timesheet-resolver.service';
import { TimesheetTableResolver } from './timesheet/timesheet-table/timesheet-table-resolver.service';
import { TimeEntryDetailComponent } from '../timesheet/time-entry/time-entry-detail.component';
import { TimeEntryResolver } from '../timesheet/time-entry/time-entry-resolver.service';
import { PartyService } from '../../api/service/party.service';
import { PartyResolver } from '../party/party/party-resolver.service';
import { UomService } from '../../api/service/uom.service';
import { UomResolver } from '../ctx-ba/uom/uom/uom-resolver.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { I18nModule } from 'app/i18n/i18n.module';
import { TimesheetTableComponent } from '../timesheet/timesheet/timesheet-table/timesheet-table.component'
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CanDeactivateGuard } from 'app/shared/can-deactivate.guard';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';


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
    TableModule,
    DialogModule,
    SharedModule,
    ButtonModule,
    ConfirmDialogModule,
    SpinnerModule,
    CalendarModule,
    ToastModule,
    DropdownModule,
    AutoCompleteModule,
    TooltipModule,
    TimesheetRoutingModule,
    I18nModule,
    CardModule,
    ProgressSpinnerModule,
    MessageModule,
    MessagesModule,
  ],
  declarations: [
    TimesheetComponent,
    TimeEntryDetailComponent,
    TimesheetTableComponent
  ],
  providers: [
    TimesheetService,
    PartyService,
    UomService,
    TimesheetResolver,
    TimeEntryResolver,
    TimesheetTableResolver,
    PartyResolver,
    UomResolver,
    ConfirmationService,
    CanDeactivateGuard
  ]
})
export class TimesheetModule { }

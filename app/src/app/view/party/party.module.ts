import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccordionModule } from 'primeng/accordion';     //accordion and accordion tab
import { TreeTableModule } from 'primeng/treetable';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { SharedModule,ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { SpinnerModule } from 'primeng/spinner';
import { CalendarModule } from 'primeng/calendar';

import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LayoutModule } from '../../layout/layout.module';

import { Party } from './party/party';
import { PartyResolver } from './party/party-resolver.service';
import { PartyComponent } from './party/party.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonsModule,
    ApiModule,
    LayoutModule,
    AccordionModule,
    DialogModule,
    SharedModule,
    ButtonModule,
    ConfirmDialogModule,
    SpinnerModule,
    CalendarModule,
    ToastModule,
    DropdownModule,
    TooltipModule,
    TreeTableModule
  ],
  declarations: [
    PartyComponent
  ],
  providers: [
    ConfirmationService,
    PartyResolver
  ]
})
export class PartyModule { }

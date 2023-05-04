import { TreeTableModule } from 'primeng/treetable';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccordionModule } from 'primeng/accordion';     //accordion and accordion tab
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { SharedModule, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SpinnerModule } from 'primeng/spinner';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';

import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LayoutModule } from '../../layout/layout.module';

import { StatusItemResolverService } from './status-item/status-item-resolver.service';
import { StatusItemComponent } from './status-item/status-item.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonsModule,
    ApiModule,
    LayoutModule,
    AccordionModule,
    TreeTableModule,
    DialogModule,
    SharedModule,
    ButtonModule,
    ConfirmDialogModule,
    SpinnerModule,
    CalendarModule,
    ToastModule,
    DropdownModule,
    TooltipModule
  ],
  declarations: [
    StatusItemComponent
  ],
  providers: [
    ConfirmationService,
    StatusItemResolverService
  ]
})
export class StatusItemModule { }

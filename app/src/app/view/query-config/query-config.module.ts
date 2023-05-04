import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AccordionModule } from 'primeng/accordion';     //accordion and accordion tab
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {DialogModule} from 'primeng/dialog';
import { SharedModule, ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SpinnerModule } from 'primeng/spinner';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LayoutModule } from '../../layout/layout.module';

import { QueryConfigComponent } from './query-config/query-config.component';
import { QueryConfigService } from '../../api/service/query-config.service';
import { QueryConfigRoutingModule } from './query-config-routing.module';
import { QueryConfigResolver } from './query-config/query-config-resolver.service';
import { QueryConfigIdResolver } from './query-config-details/query-config-id-resolver.service';
import { I18nModule } from 'app/i18n/i18n.module';
import { QueryConfigDetailsComponent } from './query-config-details/query-config-details.component';
import {SidebarModule} from 'primeng/sidebar';

@NgModule({
  imports: [
    ProgressSpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CommonsModule,
    ApiModule,
    LayoutModule,
    AccordionModule,
    DialogModule,
    SharedModule,
    ButtonModule,
    ConfirmDialogModule,
    SpinnerModule,
    ToastModule,
    DropdownModule,
    TooltipModule,
    QueryConfigRoutingModule,
    I18nModule,
    TableModule,
    SidebarModule,
    CardModule
  ],
  declarations: [
    QueryConfigComponent,
    QueryConfigDetailsComponent
  ],
  providers: [
    ConfirmationService,
    QueryConfigService,
    QueryConfigResolver,
    QueryConfigIdResolver,
    MessageService
  ]
})
export class QueryConfigModule { }

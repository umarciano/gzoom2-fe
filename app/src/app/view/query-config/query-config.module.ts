import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AccordionModule } from 'primeng/primeng';     //accordion and accordion tab
import { DropdownModule } from 'primeng/primeng';

import { DialogModule } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService, SpinnerModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LayoutModule } from '../../layout/layout.module';

import { QueryConfigComponent } from './query-config/query-config.component';
import { QueryConfigService } from '../../api/query-config.service';
import { QueryConfigRoutingModule } from './query-config-routing.module';
import { QueryConfigResolver } from './query-config/query-config-resolver.service';
import { QueryConfigIdResolver } from './query-config-details/query-config-id-resolver.service';
import { I18nModule } from 'app/i18n/i18n.module';
import { QueryConfigDetailsComponent } from './query-config-details/query-config-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
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
    QueryConfigRoutingModule,
    I18nModule,
    TableModule
  ],
  declarations: [
    QueryConfigComponent,
    QueryConfigDetailsComponent
  ],
  providers: [
    ConfirmationService,
    QueryConfigService,
    QueryConfigResolver,
    QueryConfigIdResolver
  ]
})
export class QueryConfigModule { }

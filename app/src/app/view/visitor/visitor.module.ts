import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitComponent } from './visit/visit.component';
import { VisitorRoutingModule } from './visitor-routing.module';
import { VisitorService } from 'app/api/visitor.service';
import { VisitResolver } from './visit/visit-resolver.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LayoutModule } from '../../layout/layout.module';
import { AccordionModule } from 'primeng/primeng';     //accordion and accordion tab
import { DropdownModule } from 'primeng/primeng';

import { DialogModule } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService, SpinnerModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { I18nModule } from 'app/i18n/i18n.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CommonsModule,
    ApiModule,
    LayoutModule,
    VisitorRoutingModule,
    AccordionModule,
    DataTableModule,
    DialogModule,
    SharedModule,
    I18nModule,
    ButtonModule,
    ConfirmDialogModule,
    SpinnerModule,
    GrowlModule,
    DropdownModule,
    TooltipModule
  ],
  declarations: [
    VisitComponent
  ],
  providers: [
    VisitorService,
    ConfirmationService,
    VisitResolver
  ]
})
export class VisitorModule { }

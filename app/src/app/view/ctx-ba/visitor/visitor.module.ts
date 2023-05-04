import { TableModule } from 'primeng/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitComponent } from './visit/visit.component';
import { VisitorRoutingModule } from './visitor-routing.module';
import { VisitorService } from 'app/api/service/visitor.service';
import { VisitResolver } from './visit/visit-resolver.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonsModule } from '../../../commons/commons.module';
import { ApiModule } from '../../../api/api.module';
import { LayoutModule } from '../../../layout/layout.module';
import { AccordionModule } from 'primeng/accordion';     //accordion and accordion tab
import { DropdownModule } from 'primeng/dropdown';

import { DialogModule } from 'primeng/dialog';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SpinnerModule } from 'primeng/spinner';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
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
    TableModule,
    DialogModule,
    SharedModule,
    I18nModule,
    ButtonModule,
    ConfirmDialogModule,
    SpinnerModule,
    ToastModule,
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

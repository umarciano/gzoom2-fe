import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AccordionModule } from 'primeng/accordion';     //accordion and accordion tab
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { SharedModule, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SpinnerModule } from 'primeng/spinner';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { CommonsModule } from '../../../commons/commons.module';
import { ApiModule } from '../../../api/api.module';
import { LayoutModule } from '../../../layout/layout.module';
import { UomService } from '../../../api/service/uom.service';
import { LanguageService } from '../../../api/service/language.service';

import { UomTypeResolver } from './uom-type/uom-type-resolver.service';
import { UomResolver } from './uom/uom-resolver.service';
import { UomRatingScaleResolver } from './scale/uom-rating-scale-resolver.service';
import { UomRoutingModule } from './uom-routing.module';
import { UomTypeComponent } from './uom-type/uom-type.component';
import { UomComponent } from './uom/uom.component';
import { UomRatingScaleComponent } from './scale/uom-rating-scale.component';
import { UomRangeValuesComponent } from './range-values/uom-range-values.component';

import { I18nModule } from 'app/i18n/i18n.module';
import { ToolbarModule } from 'primeng/toolbar';
import {TreeSelectModule} from 'primeng/treeselect';
import {SpeedDialModule} from 'primeng/speeddial';
import {SplitButtonModule} from 'primeng/splitbutton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CommonsModule,
    ApiModule,
    LayoutModule,
    UomRoutingModule,
    AccordionModule,
    TreeTableModule,
    TableModule,
    DialogModule,
    SharedModule,
    ButtonModule,
    ConfirmDialogModule,
    SpinnerModule,
    ToastModule,
    DropdownModule,
    TooltipModule,
    I18nModule,
    ToolbarModule,
    TreeSelectModule,
    SpeedDialModule,
    SplitButtonModule,
    SlideMenuModule,
    RippleModule,
    MenuModule,
    CardModule
  ],
  declarations: [
    UomTypeComponent,
    UomComponent,
    UomRatingScaleComponent,
    UomRangeValuesComponent
  ],
  providers: [
    UomService,
    ConfirmationService,
    UomTypeResolver,
    UomRatingScaleResolver,
    UomResolver,
    LanguageService
  ]
})
export class UomModule { }

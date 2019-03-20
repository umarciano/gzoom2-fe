import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
import { UomService } from '../../api/uom.service';

import { UomTypeResolver } from './uom-type/uom-type-resolver.service';
import { UomResolver } from './uom/uom-resolver.service';
import { UomRatingScaleResolver } from './scale/uom-rating-scale-resolver.service';
import { UomRoutingModule } from './uom-routing.module';
import { UomTypeComponent } from './uom-type/uom-type.component';
import { UomComponent } from './uom/uom.component';
import { UomRatingScaleComponent } from './scale/uom-rating-scale.component';
import { UomRangeValuesComponent } from './range-values/uom-range-values.component';

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
    DataTableModule,
    DialogModule,
    SharedModule,
    ButtonModule,
    ConfirmDialogModule,
    SpinnerModule,
    GrowlModule,
    DropdownModule,
    TooltipModule
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
    UomResolver
  ]
})
export class UomModule { }

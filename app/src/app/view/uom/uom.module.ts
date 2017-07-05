import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LayoutModule } from '../../layout/layout.module';
import { UomRoutingModule } from './uom-routing.module';

import {AccordionModule} from 'primeng/primeng';     //accordion and accordion tab
import { DropdownModule } from 'primeng/primeng';
import {MenuItem} from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';
import { ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UomTypeComponent } from './uom-type/uom-type.component';
import { UomComponent } from './uom/uom.component';
import { UomTypeResolver } from './uom-type/uom-type-resolver.service';
import { UomResolver } from './uom/uom-resolver.service';
import { UomService } from '../../api/uom.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
    GrowlModule,
    DropdownModule
  ],
  declarations: [
    UomTypeComponent,
    UomComponent
  ],
  providers: [
    UomService,
    ConfirmationService,
    UomTypeResolver,
    UomResolver
  ]
})
export class UomModule { }

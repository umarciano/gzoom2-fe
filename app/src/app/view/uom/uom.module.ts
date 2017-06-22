import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LayoutModule } from '../../layout/layout.module';
import { UomRoutingModule } from './uom-routing.module';

import { UomTypeComponent } from './uom-type/uom-type.component';

import {AccordionModule} from 'primeng/primeng';     //accordion and accordion tab
import {MenuItem} from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';
import {DataTableModule, SharedModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UomComponent } from './uom/uom.component';
import { UomTypeResolver } from './uom-type/uom-type-resolver.service';
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
    ButtonModule
  ],
  declarations: [
    UomTypeComponent,
    UomComponent
  ],
  providers: [
    UomService,
    UomTypeResolver
  ]
})
export class UomModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UomTypeResolver } from './uom-type/uom-type-resolver.service';
import { UomResolver } from './uom/uom-resolver.service';
import { UomRatingScaleResolver } from './scale/uom-rating-scale-resolver.service';

import { FocusComponent } from '../../layout/focus/focus.component';
import { UomTypeComponent } from './uom-type/uom-type.component';
import { UomComponent } from './uom/uom.component';
import { UomRatingScaleComponent } from './scale/uom-rating-scale.component';

const routes: Routes = [
  { path: 'type', component: UomTypeComponent, resolve: { uomTypes: UomTypeResolver}},
  { path: 'value', component: UomComponent, resolve: { uoms: UomResolver, uomTypes: UomTypeResolver},
    children: [
      { path: ':id', component: UomRatingScaleComponent, resolve: { uomRatingScales: UomRatingScaleResolver}}
    ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UomRoutingModule { }

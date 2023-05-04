import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UomRatingScaleResolver } from './scale/uom-rating-scale-resolver.service';
import { UomRatingScaleComponent } from './scale/uom-rating-scale.component';


import { UomTypeResolver } from './uom-type/uom-type-resolver.service';
import { UomTypeComponent } from './uom-type/uom-type.component';
import { UomResolver } from './uom/uom-resolver.service';
import { UomComponent } from './uom/uom.component';

const routes: Routes = [
  { path: 'type', component: UomTypeComponent, resolve: { uomTypes: UomTypeResolver}},
  { path: '', component: UomComponent, resolve: { uoms: UomResolver, uomTypes: UomTypeResolver}},
  { path: ':uomId', component: UomRatingScaleComponent,data: { breadcrumb: 'Measurement scale' }, resolve: { uomRatingScales: UomRatingScaleResolver, uoms: UomResolver, uomTypes: UomTypeResolver}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UomRoutingModule { }

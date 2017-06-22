import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FocusComponent } from '../../layout/focus/focus.component';
import { UomTypeComponent } from './uom-type/uom-type.component';
import { UomComponent } from './uom/uom.component';
// import { UomTypesResolver } from './uom-type/uom-type.component';

const routes: Routes = [
  { path: 'type', component: UomTypeComponent }, // , resolve: { uomTypes: UomTypesResolver } /}
  { path: 'value', component: UomComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UomRoutingModule { }

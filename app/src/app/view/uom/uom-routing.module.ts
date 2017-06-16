import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FocusComponent } from '../../layout/focus/focus.component';
import { UomTypeComponent } from './uom-type/uom-type.component';
// import { UomTypesResolver } from './uom-type/uom-type.component';

const routes: Routes = [
  { path: 'type', component: UomTypeComponent } // , resolve: { uomTypes: UomTypesResolver } /}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UomRoutingModule { }

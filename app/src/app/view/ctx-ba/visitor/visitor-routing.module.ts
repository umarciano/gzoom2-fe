import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { VisitComponent } from './visit/visit.component';
import { VisitResolver } from './visit/visit-resolver.service';

const routes: Routes = [
  { path: '', component: VisitComponent, resolve: { visitors: VisitResolver}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitorRoutingModule { }

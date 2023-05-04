import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeriodTypeComponent } from './period-type.component';
import { PeriodTypeResolver } from './period-type-resolver.service';

const routes: Routes = [
  { path: '', component: PeriodTypeComponent, resolve: { periodTypes: PeriodTypeResolver}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeriodTypeRoutingModule { }

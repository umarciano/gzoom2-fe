import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LegacyComponent } from './legacy.component';
import { SafeIdentifierGuard } from '../../shared/safe-identifier.guard';

const routes: Routes = [
  { path: ':id', component: LegacyComponent, canActivate: [SafeIdentifierGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegacyRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FocusComponent } from '../../layout/focus/focus.component';

import { WorkEffortComponent } from './work-effort/work-effort.component';
import { WorkEffortResolverService } from './work-effort/work-effort-resolver.service';

const routes: Routes = [
{ path: '', component: WorkEffortComponent, resolve: { roleTypes: WorkEffortResolverService}}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleTypeRoutingModule { }

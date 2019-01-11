import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FocusComponent } from '../../layout/focus/focus.component';

import { RoleTypeComponent } from './role-type/role-type.component';
import { RoleTypeResolverService } from './role-type/role-type-resolver.service';

const routes: Routes = [
{ path: '', component: RoleTypeComponent, resolve: { roleTypes: RoleTypeResolverService}}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleTypeRoutingModule { }

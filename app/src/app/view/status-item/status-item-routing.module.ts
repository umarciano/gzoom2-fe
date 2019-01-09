import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FocusComponent } from '../../layout/focus/focus.component';

import { StatusItemComponent } from './status-item/status-item.component';
import { StatusItemResolverService } from './status-item/status-item-resolver.service';

const routes: Routes = [
{ path: '', component: StatusItemComponent, resolve: { partys: StatusItemResolverService}}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusItemRoutingModule { }

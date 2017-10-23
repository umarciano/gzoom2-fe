import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FocusComponent } from '../../layout/focus/focus.component';

import { PartyComponent } from './party/party.component';
import { PartyResolver } from './party/party-resolver.service';

const routes: Routes = [
{ path: '', component: PartyComponent, resolve: { partys: PartyResolver}}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyRoutingModule { }

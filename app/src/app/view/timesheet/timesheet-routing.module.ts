import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FocusComponent } from '../../layout/focus/focus.component';
import { PartyPeriodComponent } from './party-period/party-period.component';
import { PartyPeriodResolver } from './party-period/party-period-resolver.service';

const routes: Routes = [
{ path: 'party-period', component: PartyPeriodComponent, resolve: { partyPeriods: PartyPeriodResolver}}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule { }

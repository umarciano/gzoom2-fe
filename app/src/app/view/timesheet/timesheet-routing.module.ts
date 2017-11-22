import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FocusComponent } from '../../layout/focus/focus.component';

import { TimesheetResolver } from './timesheet/timesheet-resolver.service';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { TimeEntryResolver } from './time-entry/time-entry-resolver.service';
import { TimeEntryComponent } from './time-entry/time-entry.component';

import { PartyResolver } from '../party/party/party-resolver.service';

const routes: Routes = [
{ path: '', component: TimesheetComponent, resolve: { timesheets: TimesheetResolver, partys: PartyResolver}},
{ path: 'time-entry', component: TimeEntryComponent, resolve: { timeEntries: TimeEntryResolver}}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule { }

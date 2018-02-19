import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FocusComponent } from '../../layout/focus/focus.component';

import { TimesheetResolver } from './timesheet/timesheet-resolver.service';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { TimeEntryResolver } from './time-entry/time-entry-resolver.service';
import { WorkEffortResolver } from './time-entry/work-effort-resolver.service';
import { TimeEntryComponent } from './time-entry/time-entry.component';
import { TimeEntryDetailComponent } from './time-entry/time-entry-detail.component';

import { PartyResolver } from '../party/party/party-resolver.service';

const routes: Routes = [
  { path: ':id', component: TimeEntryDetailComponent, resolve: { timeEntries: TimeEntryResolver,
                                                                workEfforts: WorkEffortResolver,
                                                                timesheet: TimesheetResolver}},
  { path: '', component: TimesheetComponent, resolve: { timesheets: TimesheetResolver, partys: PartyResolver}}                                                          
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule { }

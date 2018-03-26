import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FocusComponent } from '../../layout/focus/focus.component';

import { TimesheetResolver } from './timesheet/timesheet-resolver.service';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { TimeEntryResolver } from './time-entry/time-entry-resolver.service';
import { WorkEffortResolver } from './time-entry/work-effort-resolver.service';
import { TimeEntryDetailComponent } from './time-entry/time-entry-detail.component';

import { PartyResolver } from '../party/party/party-resolver.service';
import { UomResolver } from '../uom/uom/uom-resolver.service';

const routes: Routes = [
  { path: ':id', component: TimeEntryDetailComponent, resolve: { timeEntries: TimeEntryResolver,
                                                                workEfforts: WorkEffortResolver,
                                                                timesheet: TimesheetResolver,
                                                                uom: UomResolver}},
  { path: '', component: TimesheetComponent, resolve: { timesheets: TimesheetResolver, 
                                                        partys: PartyResolver,
                                                        uom: UomResolver}}                                                          
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule { }

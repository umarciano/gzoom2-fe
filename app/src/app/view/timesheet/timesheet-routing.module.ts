import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimesheetResolver } from './timesheet/timesheet-resolver.service';
import { TimesheetComponent } from '../timesheet/timesheet/timesheet.component';
import { TimeEntryResolver } from '../timesheet/time-entry/time-entry-resolver.service';
import { TimeEntryDetailComponent } from '../timesheet/time-entry/time-entry-detail.component';
import { CanDeactivateGuard } from 'app/shared/can-deactivate.guard';

const routes: Routes = [
  { path: ':id', component: TimeEntryDetailComponent,canDeactivate: [CanDeactivateGuard], resolve: { timeEntries: TimeEntryResolver,
                                                                timesheet: TimesheetResolver}},
  { path: '', component: TimesheetComponent, resolve: { params: TimesheetResolver}}                                                
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule { }

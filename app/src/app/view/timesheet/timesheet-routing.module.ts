import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FocusComponent } from '../../layout/focus/focus.component';

import { TimesheetResolver } from './timesheet/timesheet-resolver.service';
import { TimesheetComponent } from './timesheet/timesheet.component';

const routes: Routes = [
{ path: '', component: TimesheetComponent, resolve: { timesheets: TimesheetResolver}}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule { }

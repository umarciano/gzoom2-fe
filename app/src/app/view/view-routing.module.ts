import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../commons/guard.service';
import { PermissionsResolver } from '../shared/permissions-resolver.service';
import { MenuResolver } from '../shared/menu-resolver.service';
import { VisualThemeNAResolver } from '../shared/visual-theme-na-resolver.service';
import { VisualThemeResolver } from '../shared/visual-theme-resolver.service';
import { NodeResolver } from '../shared/node-resolver.service';
import { FocusComponent } from '../layout/focus/focus.component';
import { ContentComponent } from '../layout/content/content.component';
import { LocalizationResolver } from 'app/shared/localization-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: FocusComponent,
    resolve: {
     node: NodeResolver
    },
    children: [
      { path: 'login', loadChildren: './login/login.module#LoginModule' }
    ]
  },
  {
    path: 'c',
    component: ContentComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    resolve: {
      permissions: PermissionsResolver,
      locale: LocalizationResolver,
      menu: MenuResolver,
      node: NodeResolver
      , theme: VisualThemeResolver
    },
    children: [
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'legacy', loadChildren: './legacy/legacy.module#LegacyModule' },
      { path: 'uom', loadChildren: './uom/uom.module#UomModule' },
      { path: 'timesheet', loadChildren: './timesheet/timesheet.module#TimesheetModule' },
      { path: 'report-print', loadChildren: './report-print/report-print.module#ReportPrintModule' },
      { path: 'visitor', loadChildren: './visitor/visitor.module#VisitorModule' },
      { path: 'queryconfig', loadChildren: './query-config/query-config.module#QueryConfigModule' },
      //{ path: 'work-effort-type-report', loadChildren: './work-effort-type-report/work-effort-type-report.module#WorkEffortTypeReportModule' },
      { path: '', pathMatch: 'full', redirectTo: '/c/dashboard' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [RouterModule]
})
export class ViewRoutingModule { }

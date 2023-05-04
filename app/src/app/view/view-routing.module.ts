import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../commons/service/guard.service';
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
      { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) }
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
      node: NodeResolver,
      theme: VisualThemeResolver
    },
    children: [
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'legacy', loadChildren: () => import('./legacy/legacy.module').then(m => m.LegacyModule)},
      { path: 'CTX_BA', loadChildren: () => import('./ctx-ba/ctx_ba-routing.module').then(m => m.ctx_baRoutingModule),data: { breadcrumb: 'CTX_BA' }},
      { path: ':context/report-print', loadChildren: () => import('./report-print/report-print.module').then(m => m.ReportPrintModule), data: { breadcrumb: ':context/report-print'} },
      { path: ':context/queryconfig/:id', loadChildren: () => import('./query-config/query-config.module').then(m => m.QueryConfigModule), data: { breadcrumb: ':context/Esecutore-Query'} },
      { path: ':context/analysis', loadChildren: () => import('./analysis/analysis.module').then( m => m.AnalysisModule), data: { breadcrumb: ':context/Analysis'}},
      { path: ':context/timesheet', loadChildren: () => import('./timesheet/timesheet.module').then( m => m.TimesheetModule), data: { breadcrumb: ':context/TimeSheet'}},
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

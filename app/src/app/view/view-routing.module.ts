import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../commons/guard.service';
import { PermissionsResolver } from '../shared/permissions-resolver.service';
import { MenuResolver } from '../shared/menu-resolver.service';
import { FocusComponent } from '../layout/focus/focus.component';
import { ContentComponent } from '../layout/content/content.component';

const routes: Routes = [
  {
    path: '',
    component: FocusComponent,
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
      menu: MenuResolver
    },
    children: [
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'legacy', loadChildren: './legacy/legacy.module#LegacyModule' },
      { path: 'uom', loadChildren: './uom/uom.module#UomModule' },
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

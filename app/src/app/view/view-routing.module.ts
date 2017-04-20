import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../commons/guard.service';

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
    path: '',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }

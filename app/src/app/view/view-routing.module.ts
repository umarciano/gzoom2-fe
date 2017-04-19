import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FocusComponent } from '../layout/focus/focus.component';

const routes: Routes = [
  //{ path: 'login', loadChildren: './login/login.module#LoginModule' }
  {
    path: '',
    component: FocusComponent,
    children: [
      { path: 'login', loadChildren: './login/login.module#LoginModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }

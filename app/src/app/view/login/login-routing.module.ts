import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../commons/guard.service';

import { FocusComponent } from '../../layouts/focus/focus.component';
import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: '',
    component: FocusComponent,
    children: [
      { path: 'login', component: LoginComponent },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FocusComponent } from '../../layouts/focus/focus.component';
import { LoginComponent } from './login.component';

const routes: Routes = [{
  path: '',
  component: FocusComponent,
  children: [{ path: '', component: LoginComponent }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }

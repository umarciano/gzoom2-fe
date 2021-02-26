import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FocusComponent } from '../../layout/focus/focus.component';
import { LoginComponent } from './login.component';
import { NodeResolver } from '../../shared/node-resolver.service';
import { VisualThemeNAResolver } from '../../shared/visual-theme-na-resolver.service';

const routes: Routes = [
  { path: '', component: LoginComponent, resolve: { node: NodeResolver, theme: VisualThemeNAResolver }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }

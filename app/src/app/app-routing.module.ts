import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './commons/guard.service';


const routes: Routes = [
  { path: '', loadChildren: './view/view.module#ViewModule' }, // modul ocaricato i nmaniera lazy
  { path: '**', redirectTo: '/c/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

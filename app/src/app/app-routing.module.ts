import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './commons/guard.service';


const routes: Routes = [
  { path: '', loadChildren: './view/view.module#ViewModule' }, // modulo caricato in maniera lazy
  { path: '**', redirectTo: '/c/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})], // enableTracing: true per abilitare i log della navigazione
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './commons/service/guard.service';


const routes: Routes = [
  { path: '', loadChildren: () => import('./view/view.module').then(m => m.ViewModule) }, // modulo caricato in maniera lazy
  { path: '**', redirectTo: '/c/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })], // enableTracing: true per abilitare i log della navigazione
  exports: [RouterModule]
})
export class AppRoutingModule { }

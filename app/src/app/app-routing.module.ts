import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './commons/guard.service';

import { HeroesComponent } from './heroes.component';
import { HeroDetailComponent } from './hero-detail.component';

const routes: Routes = [
  { path: '', loadChildren: './view/view.module#ViewModule' },
  { path: 'detail/:id', component: HeroDetailComponent, canActivate: [AuthGuard] },
  { path: 'heroes', component: HeroesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/c/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

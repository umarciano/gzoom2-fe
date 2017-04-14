import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './commons/guard.service';

import { LoginComponent } from './view/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes.component';
import { HeroDetailComponent } from './hero-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'detail/:id', component: HeroDetailComponent, canActivate: [AuthGuard] },
  { path: 'heroes', component: HeroesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

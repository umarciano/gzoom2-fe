import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CommonsModule } from './commons/commons.module';
import { ApiModule } from './api/api.module';
import { LoginModule } from './view/login/login.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes.component';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroSearchComponent } from './hero-search/hero-search.component';

import { HeroService } from './hero.service';

@NgModule({
  imports: [
    // angular modules
    BrowserModule,
    FormsModule,
    HttpModule,
    // application modules
    // > libraries
    CommonsModule,
    /*
    .forRoot({
      authService: { tokenKey: 'xxx-auth-token', permissionsGetter: null },
      authGuard: { loginRoute: 'xxx' }
    })
     */
    ApiModule,
    // > views
    LoginModule,
    // > routes
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroesComponent,
    HeroDetailComponent,
    HeroSearchComponent
  ],
  providers: [HeroService],
  bootstrap: [AppComponent]
})
export class AppModule { }

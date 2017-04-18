// angular modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// application modules
import { CommonsModule } from './commons/commons.module';
import { ApiModule } from './api/api.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes.component';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroSearchComponent } from './hero-search/hero-search.component';

import { HeroService } from './hero.service';

// generic components
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { TopbarComponent } from './layouts/topbar/topbar.component';

const ROOT_PATH = '../rest';

@NgModule({
  imports: [
    // angular modules
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    // application modules
    // > libraries
    CommonsModule.forRoot({ i18n: { rootPath: ROOT_PATH } }),
    ApiModule.forRoot({ rootPath: ROOT_PATH }),
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

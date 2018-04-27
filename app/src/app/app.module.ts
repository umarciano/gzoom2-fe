// angular modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// ng-bootstrap modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// application modules
import { CommonsModule } from './commons/commons.module';
import { ApiModule } from './api/api.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes.component';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroSearchComponent } from './hero-search/hero-search.component';

import { HeroService } from './hero.service';

import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {AuthInterceptor} from './api/auth-interceptor';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import localeItExtra from '@angular/common/locales/extra/it';
registerLocaleData(localeIt, localeItExtra);


const ROOT_PATH = '../rest';
const GZOOM_PATH = '/gzoom/control/box';

@NgModule({
  imports: [
    // angular modules
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    // ng-bootstrap
    NgbModule.forRoot(),
    // application modules
    // > libraries
    CommonsModule.forRoot({
      application: { name: 'GZoom', version: '2.0.10rc1' },
      i18n: { rootPath: ROOT_PATH }
    }),
    ApiModule.forRoot({ rootPath: ROOT_PATH, gzoomPath: GZOOM_PATH }),
    SharedModule.forRoot(),
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
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
  {
    provide: LOCALE_ID, 
    useValue: navigator.language
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

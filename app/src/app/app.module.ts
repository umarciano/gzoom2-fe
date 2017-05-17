// angular modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

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

const ROOT_PATH = '../rest';
const LEGACY_PATH = '../legacy';

@NgModule({
  imports: [
    // angular modules
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    // ng-bootstrap
    NgbModule.forRoot(),
    // application modules
    // > libraries
    CommonsModule.forRoot({
      application: { name: 'GZoom', version: '2.0.0' },
      i18n: { rootPath: ROOT_PATH }
    }),
    ApiModule.forRoot({ rootPath: ROOT_PATH, legacyPath: LEGACY_PATH }),
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
  providers: [HeroService],
  bootstrap: [AppComponent]
})
export class AppModule { }

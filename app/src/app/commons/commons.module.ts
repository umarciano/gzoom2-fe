import { NgModule, ModuleWithProviders, Injectable, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AuthService, AuthServiceConfig } from './auth.service';
import { AuthGuard } from './guard.service';
import { LockoutService, LockoutConfig } from './lockout.service';
import { ApplicationConfig } from './config';
import { FullnamePipe, AsIdPipe, AsClassPipe } from './commons.pipe';
import {
  ApplicationVersionDirective,
  ApplicationNameDirective,
  FromYearDirective
} from './commons.directive';

export interface CommonsConfig {
  /* mandatory attributes */
  application: ApplicationConfig;
  /* optional attributes */
  authService?: AuthServiceConfig;
  lockout?: LockoutConfig;
}

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [
    FullnamePipe,
    AsIdPipe,
    AsClassPipe,
    ApplicationVersionDirective,
    ApplicationNameDirective,
    FromYearDirective
  ],
  exports: [
    FullnamePipe,
    AsIdPipe,
    AsClassPipe,
    ApplicationVersionDirective,
    ApplicationNameDirective,
    FromYearDirective
  ]
})
export class CommonsModule {

  /**
  * Configures the CommonsModule.
  *
  * @param  {CommonsConfig} config Module configuration
  * @return {ModuleWithProviders} The module with the providers
  */
  static forRoot(config: CommonsConfig): ModuleWithProviders {
    return {
      ngModule: CommonsModule,
      providers: [
        { provide: AuthServiceConfig, useValue: config.authService },
        { provide: LockoutConfig, useValue: config.lockout },
        // oppure ApplicationConfig viene fornita usando il valore contenuto in useValue
        { provide: ApplicationConfig, useValue: config.application },
        AuthService, // nome classe funziona come placeholder e quindi lo istanzia
        LockoutService,
        AuthGuard
      ]
    };
  }
}

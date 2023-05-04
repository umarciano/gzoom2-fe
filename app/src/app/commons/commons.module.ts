import { NgModule, ModuleWithProviders, Injectable, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AuthService, AuthServiceConfig } from './service/auth.service';
import { AuthGuard } from './service/guard.service';
import { LockoutService, LockoutConfig } from './service/lockout.service';
import { ApplicationConfig } from './model/config';
import { FullnamePipe, AsIdPipe, AsClassPipe } from './commons.pipe';
import { EnumerationService } from '../api/service/enumeration.service';

import {
  ApplicationVersionDirective,
  ApplicationMajorMinorVersionDirective,
  ApplicationNameDirective,
  FromYearDirective
} from './commons.directive';
import { CallbackPipe } from './callback.pipe';

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
    ApplicationMajorMinorVersionDirective,
    ApplicationNameDirective,
    FromYearDirective,
    CallbackPipe
  ],
  exports: [
    FullnamePipe,
    AsIdPipe,
    AsClassPipe,
    ApplicationVersionDirective,
    ApplicationMajorMinorVersionDirective,
    ApplicationNameDirective,
    FromYearDirective,
    CallbackPipe
  ]
})
export class CommonsModule {

  /**
  * Configures the CommonsModule.
  *
  * @param  {CommonsConfig} config Module configuration
  * @return {ModuleWithProviders} The module with the providers
  */
  static forRoot(config: CommonsConfig): ModuleWithProviders<CommonsModule> {
    return {
      ngModule: CommonsModule,
      providers: [
        { provide: AuthServiceConfig, useValue: config.authService },
        { provide: LockoutConfig, useValue: config.lockout },
        // oppure ApplicationConfig viene fornita usando il valore contenuto in useValue
        { provide: ApplicationConfig, useValue: config.application },
        AuthService, // nome classe funziona come placeholder e quindi lo istanzia
        LockoutService,
        EnumerationService,
        AuthGuard
      ]
    };
  }
}

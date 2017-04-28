import { NgModule, ModuleWithProviders, Injectable, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AuthService, AuthServiceConfig } from './auth.service';
import { AuthGuard } from './guard.service';
import { LockoutService, LockoutConfig } from './lockout.service';
import { I18NService, I18NConfig, load } from './i18n.service';
import { ApplicationConfig } from './config';
import { I18NPipe } from './i18n.pipe';
import { FullnamePipe, AsIdPipe, AsClassPipe } from './commons.pipe';
import { ApplicationVersionDirective, ApplicationNameDirective } from './commons.directive';

export interface CommonsConfig {
  /* mandatory attributes */
  i18n: I18NConfig;
  application: ApplicationConfig;
  /* optional attributes */
  authService?: AuthServiceConfig;
  lockout?: LockoutConfig;
}

@NgModule({
  imports: [CommonModule, HttpModule],
  declarations: [
    I18NPipe,
    FullnamePipe,
    AsIdPipe,
    AsClassPipe,
    ApplicationVersionDirective,
    ApplicationNameDirective
  ],
  exports: [
    I18NPipe,
    FullnamePipe,
    AsIdPipe,
    AsClassPipe,
    ApplicationVersionDirective,
    ApplicationNameDirective
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
        { provide: I18NConfig, useValue: config.i18n },
        { provide: ApplicationConfig, useValue: config.application },
        /* next line loads the i18n configuration from server during bootstrap */
        { provide: APP_INITIALIZER, useFactory: load, deps: [Http, I18NConfig], multi: true },
        AuthService,
        LockoutService,
        AuthGuard,
        I18NService
      ]
    };
  }
}

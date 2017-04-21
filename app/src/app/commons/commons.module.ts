import { NgModule, ModuleWithProviders, Injectable, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AuthService, AuthServiceConfig } from './auth.service';
import { AuthGuard, AuthGuardConfig } from './guard.service';
import { I18NService, I18NConfig, load } from './i18n.service';
import { ApplicationConfig } from './config';
import { I18NPipe } from './i18n.pipe';
import { VersionDirective } from './version.directive';

export interface CommonsConfig {
  /* mandatory attributes */
  i18n: I18NConfig;
  application: ApplicationConfig;
  /* optional attributes */
  authService?: AuthServiceConfig;
  authGuard?: AuthGuardConfig;
}

@NgModule({
  imports: [CommonModule, HttpModule],
  declarations: [I18NPipe, VersionDirective],
  exports: [I18NPipe, VersionDirective]
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
        { provide: AuthGuardConfig, useValue: config.authGuard },
        { provide: I18NConfig, useValue: config.i18n },
        { provide: ApplicationConfig, useValue: config.application },
        /* next line loads the i18n configuration from server during bootstrap */
        { provide: APP_INITIALIZER, useFactory: load, deps: [Http, I18NConfig], multi: true },
        AuthService,
        AuthGuard,
        I18NService
      ]
    };
  }
}

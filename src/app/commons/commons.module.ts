import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AuthService, AuthServiceConfig } from './auth.service';
import { AuthGuard, AuthGuardConfig } from './guard.service';
import { I18NService, I18NConfig, load } from './i18n.service';

import { I18NPipe } from './i18n.pipe';

export interface CommonsConfig {
  authService?: AuthServiceConfig;
  authGuard?: AuthGuardConfig;
  i18n: I18NConfig; /* this is mandatory and must be configured */
}

@NgModule({
  imports: [CommonModule, HttpModule],
  declarations: [I18NPipe],
  exports: [I18NPipe]
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
        { provide: APP_INITIALIZER, useFactory: load, deps: [Http, I18NConfig], multi: true },
        AuthService,
        AuthGuard,
        I18NService
      ]
    };
  }
}

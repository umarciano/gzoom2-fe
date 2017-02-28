import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Http } from '@angular/http';

import { AuthService, AuthServiceConfig } from './auth.service';
import { AuthGuard, AuthGuardConfig } from './guard.service';
import { I18NService, I18NConfig, load } from './i18n.service';

import { I18NPipe } from './i18n.pipe';

export class CommonsConfig {
  readonly authService: AuthServiceConfig = new AuthServiceConfig();
  readonly authGuard: AuthGuardConfig = new AuthGuardConfig();
  readonly i18n: I18NConfig = new I18NConfig();
}

const DEF_CONFIG = new CommonsConfig();

@NgModule({
  imports: [CommonModule],
  declarations: [I18NPipe],
  exports: [I18NPipe]
})
export class CommonsModule {

  static forRoot(config: CommonsConfig = DEF_CONFIG): ModuleWithProviders {
    return {
      ngModule: CommonsModule,
      providers: [
        { provide: AuthServiceConfig, useValue: config.authService || DEF_CONFIG.authService },
        { provide: AuthGuardConfig, useValue: config.authGuard || DEF_CONFIG.authGuard },
        { provide: I18NConfig, useValue: config.i18n || DEF_CONFIG.i18n },
        { provide: APP_INITIALIZER, useFactory: load, deps: [Http, I18NConfig], multi: true },
        AuthService,
        AuthGuard,
        I18NService
      ]
    };
  }

}

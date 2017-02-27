import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService, AuthServiceConfig, DEF_AUTH_SERVICE_CONFIG } from './auth.service';
import { AuthGuard, AuthGuardConfig, DEF_AUTH_GUARD_CONFIG } from './guard.service';

export class CommonsConfig {
  authService: AuthServiceConfig = DEF_AUTH_SERVICE_CONFIG;
  authGuard: AuthGuardConfig = DEF_AUTH_GUARD_CONFIG;
}

const DEF_CONFIG = new CommonsConfig();

@NgModule({
  imports: [CommonModule],
  declarations: []
})
export class CommonsModule {

  static forRoot(config: CommonsConfig = DEF_CONFIG): ModuleWithProviders {
    return {
      ngModule: CommonsModule,
      providers: [
        { provide: AuthServiceConfig, useValue: config.authService || DEF_CONFIG.authService },
        { provide: AuthGuardConfig, useValue: config.authGuard || DEF_CONFIG.authGuard },
        AuthService,
        AuthGuard
      ]
    };
  }

}

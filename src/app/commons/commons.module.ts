import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService, AuthServiceConfig } from './auth.service';
import { AuthGuard, AuthGuardConfig } from './auth.guard';

export interface CommonsConfig {
  authService: AuthServiceConfig;
  authGuard: AuthGuardConfig;
}

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [AuthService, AuthGuard]
})
export class CommonsModule {

  static forRoot(config: CommonsConfig): ModuleWithProviders {
    return {
      ngModule: CommonsModule,
      providers: [
        { provide: AuthService, useValue: config.authService },
        { provide: AuthGuard, useValue: config.authGuard }
      ]
    };
  }

  constructor( @Optional() @SkipSelf() parentModule: CommonsModule) {
    // sanity check
    if (parentModule) {
      throw new Error(
        'CommonsModule is already loaded. Import it in the AppModule only');
    }
  }

}

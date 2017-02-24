import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService, AuthServiceConfig } from './auth.service';
import { AuthGuard, AuthGuardConfig } from './auth.guard';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [AuthService, AuthGuard]
})
export class CommonsModule {

  static forRoot(asc: AuthServiceConfig, agc: AuthGuardConfig): ModuleWithProviders {
    return {
      ngModule: CommonsModule,
      providers: [
        { provide: AuthService, useValue: asc },
        { provide: AuthGuard, useValue: agc }
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

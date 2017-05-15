import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonsModule } from '../commons/commons.module';
import { ApiModule } from '../api/api.module';

import { AuthorizationService } from './authorization.service';
import { MenuRefurbishService } from './menu-refurbish.service';
import { PermissionsResolver } from './permissions-resolver.service';
import { MenuResolver } from './menu-resolver.service';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    ApiModule
  ],
  declarations: []
})
export class SharedModule {

  /**
   * Declares providers for child inclusion.
   *
   * @return {ModuleWithProviders} The module with the providers
   */
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AuthorizationService,
        MenuRefurbishService,
        PermissionsResolver,
        MenuResolver
      ]
    };
  }
}

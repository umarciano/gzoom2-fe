import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonsModule } from '../commons/commons.module';
import { ApiModule } from '../api/api.module';

import { AuthorizationService } from './authorization.service';
import { MenuService } from './menu.service';
import { PermissionsResolver } from './permissions-resolver.service';
import { MenuResolver } from './menu-resolver.service';
import { SafeResPipe } from './safe-res.pipe';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    ApiModule
  ],
  declarations: [SafeResPipe]
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
        MenuService,
        PermissionsResolver,
        MenuResolver
      ]
    };
  }
}

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonsModule } from '../commons/commons.module';
import { ApiModule } from '../api/api.module';

import { AuthorizationService } from './authorization.service';
import { MenuService } from './menu.service';
import { NodeService } from './node.service';
import { LoaderService } from './loader/loader.service';
import { PermissionsResolver } from './permissions-resolver.service';
import { MenuResolver } from './menu-resolver.service';
import { NodeResolver } from './node-resolver.service';
import { SafeResPipe } from './safe-res.pipe';
import { SafeIdentifierGuard } from './safe-identifier.guard';
import { DownloadActivityService } from './report-download/download-activity.service';
import { LocalizationResolver } from './localization-resolver.service';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    ApiModule
  ],
  declarations: [SafeResPipe],
  exports: [SafeResPipe]
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
        NodeService,
        PermissionsResolver,
        MenuResolver,
        LocalizationResolver,
        NodeResolver,
        LoaderService,
        SafeIdentifierGuard,
        DownloadActivityService,
      ]
    };
  }
}

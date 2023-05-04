import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonsModule } from '../commons/commons.module';
import { ApiModule } from '../api/api.module';

import { ReportPopupService } from './report-popup/report-popup.service';
import { AuthorizationService } from './authorization.service';
import { MenuService } from './menu.service';
import { NodeService } from './node.service';
import { LoaderService } from './loader/loader.service';
import { PermissionsResolver } from './permissions-resolver.service';
import { MenuResolver } from './menu-resolver.service';
import { NodeResolver } from './node-resolver.service';
import { VisualThemeResolver } from './visual-theme-resolver.service';
import { VisualThemeNAResolver } from './visual-theme-na-resolver.service';
import { SafeResPipe } from './safe-res.pipe';
import { SafeIdentifierGuard } from './safe-identifier.guard';
import { DownloadActivityService } from './report-download/download-activity.service';
import { ChangePasswordService } from './change-password/change-password.service';
import { LocalizationResolver } from './localization-resolver.service';
import { CustomTimePeriodService } from 'app/commons/service/custom-time-period.service';
import { ReportService } from 'app/api/service/report.service';

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
  static forRoot(): ModuleWithProviders<SharedModule> {
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
        VisualThemeNAResolver,
        VisualThemeResolver,
        LoaderService,
        ReportPopupService,
        ReportService,
        SafeIdentifierGuard,
        DownloadActivityService,
        ChangePasswordService,
        CustomTimePeriodService
      ]
    };
  }
}

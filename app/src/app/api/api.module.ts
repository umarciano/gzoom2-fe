import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule  } from '@angular/common/http';

import { CommonsModule } from '../commons/commons.module';

// module config
import { ApiConfig } from '../commons/model/api-config';

// api services
import { ApiClientService } from '../commons/service/client.service';
import { LoginService } from '../commons/service/login.service';
import { UserPreferenceService } from './service/user-preference.service';
import { LogoutService } from '../commons/service/logout.service';
import { AccountService } from '../commons/service/account.service';
import { MenuService } from '../commons/service/menu.service';
import { ResourceService } from '../commons/service/resource.service';
import { WorkEffortTypeService } from './service/work-effort-type.service';
import { WorkEffortRevisionService } from './service/work-effort-revision.service';
import { WorkEffortTypeContentService } from './service/work-effort-type-content.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    CommonsModule
  ],
  declarations: []
})
export class ApiModule {

  /**
  * Configures the ApiModule.
  *
  * @param  {ApiConfig} config Module configuration
  * @return {ModuleWithProviders} The module with the providers
  */
  static forRoot(config: ApiConfig): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        { provide: ApiConfig, useValue: config },
        LoginService,
        UserPreferenceService,
        ApiClientService,
        LogoutService,
        AccountService,
        MenuService,
        ResourceService,
        WorkEffortTypeService,
        WorkEffortTypeContentService,
        WorkEffortRevisionService
      ]
    };
  }
}

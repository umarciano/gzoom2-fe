import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule  } from '@angular/common/http';

import { CommonsModule } from '../commons/commons.module';

// module config
import { ApiConfig } from './api-config';

// api services
import { ApiClientService } from './client.service';
import { LoginService } from './login.service';
import { UserPreferenceService } from './user-preference.service';
import { LogoutService } from './logout.service';
import { AccountService } from './account.service';
import { MenuService } from './menu.service';
import { ResourceService } from './resource.service';
import { WorkEffortTypeService } from './work-effort-type.service';
import { WorkEffortRevisionService } from './work-effort-revision.service';

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
  static forRoot(config: ApiConfig): ModuleWithProviders {
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
        WorkEffortRevisionService
      ]
    };
  }
}

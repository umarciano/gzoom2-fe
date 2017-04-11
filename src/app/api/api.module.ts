import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

// module config
import { ApiConfig } from './api-config';

// api services
import { ApiClientService } from './client.service';
import { LoginService } from './login.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
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
        ApiClientService
      ]
    };
  }
}

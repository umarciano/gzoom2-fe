import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

// module config
import { ApiConfig, DEF_API_CONFIG } from './api-config';

// api services
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
   * @param  {ApiConfig = DEF_API_CONFIG} config Module configuration
   * @return {ModuleWithProviders}   The module with the providers
   */
  static forRoot(config: ApiConfig = DEF_API_CONFIG): ModuleWithProviders {
    return {
      ngModule: ApiModule,
      providers: [
        { provide: ApiConfig, useValue: config },
        LoginService
      ]
    };
  }
}

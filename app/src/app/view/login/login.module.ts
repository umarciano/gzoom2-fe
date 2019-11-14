import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LayoutModule } from '../../layout/layout.module';
import { LoginRoutingModule } from './login-routing.module';

import { NodeResolver } from '../../shared/node-resolver.service';
import { NodeService } from '../../shared/node.service';
import { LoginComponent } from './login.component';

import { I18nModule } from 'app/i18n/i18n.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonsModule,
    ApiModule,
    LayoutModule,
    LoginRoutingModule,
    I18nModule
  ],
  providers: [    
    NodeResolver,
    NodeService
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule { }

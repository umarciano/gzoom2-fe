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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonsModule,
    ApiModule,
    LayoutModule,
    LoginRoutingModule
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

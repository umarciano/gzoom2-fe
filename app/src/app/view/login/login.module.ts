import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LoginRoutingModule } from './login-routing.module';

import { FocusComponent } from '../../layouts/focus/focus.component';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonsModule,
    ApiModule,
    LoginRoutingModule
  ],
  declarations: [
    FocusComponent,
    LoginComponent
  ]
})
export class LoginModule { }

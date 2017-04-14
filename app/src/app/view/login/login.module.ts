import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiModule } from '../../api/api.module';
import { LoginRoutingModule } from './login-routing.module';

import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ApiModule,
    LoginRoutingModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }

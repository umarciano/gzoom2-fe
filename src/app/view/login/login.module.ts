import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiModule } from '../../api/api.module';
import { CommonsModule } from '../../commons/commons.module';

import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonsModule,
    ApiModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }

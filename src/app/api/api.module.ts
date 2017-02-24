import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { LoginService } from './login.service';

import { Headers } from '@angular/http';

export const HTTP_HEADERS = new Headers({ 'Content-Type': 'application/json' });

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [],
  providers: [LoginService]
})
export class ApiModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonsModule } from '../commons/commons.module';

import { FocusComponent } from './focus/focus.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CommonsModule
  ],
  declarations: [
    FocusComponent
  ]
})
export class LayoutModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';

import { CommonsModule } from '../../commons/commons.module';
import { ApiModule } from '../../api/api.module';
import { LayoutModule } from '../../layout/layout.module';
import { I18nModule } from 'app/i18n/i18n.module';

import { ConsuntivazioneRoutingModule } from './consuntivazione-routing.module';
import { ConsuntivazioneComponent } from './consuntivazione.component';
import { ConsuntivazioneService } from '../../api/service/consuntivazione.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonsModule,
    ApiModule,
    LayoutModule,
    I18nModule,
    ConsuntivazioneRoutingModule,
    TableModule,
    TreeTableModule,
    TreeModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    TooltipModule,
    CardModule,
    ConfirmDialogModule,
    InputTextModule,
    RadioButtonModule
  ],
  declarations: [
    ConsuntivazioneComponent
  ],
  providers: [
    ConsuntivazioneService,
    ConfirmationService
  ]
})
export class ConsuntivazioneModule { }

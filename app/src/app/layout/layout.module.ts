import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonsModule } from '../commons/commons.module';
import { ApiModule } from '../api/api.module';
import { SharedModule } from '../shared/shared.module';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EqualValidator } from '../commons/equal-validator.directive';
import { I18nModule } from 'app/i18n/i18n.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToastModule } from 'primeng/toast';
import { SlideMenuModule } from 'primeng/slidemenu';
import { layoutComponents } from '.';
import { ToolbarModule } from 'primeng/toolbar';
import { NgxGaugeModule } from 'ngx-gauge';
import { ChartComponent } from './chart/chart.component';
import { ChartModule } from 'primeng/chart';
import { ReportDownloadService } from 'app/api/service/report-download.service';
import {ProgressBarModule} from 'primeng/progressbar';
import {SidebarModule} from 'primeng/sidebar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { IconCustomComponent } from './icon-custom/icon-custom.component';
import { LanguageService } from '../api/service/language.service';
import { TableCalendarComponent } from './table-calendar/table-calendar.component';
import { TableEditingCellComponent } from './table-editing-cell/table-editing-cell.component';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import { InformationBarComponent } from './information-bar/information-bar.component';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CommonsModule,
    ApiModule,
    SharedModule,
    NgbModule,
    DialogModule,
    ToastModule,
    DropdownModule,
    TreeTableModule,
    ProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    I18nModule,
    BreadcrumbModule,
    TableModule,
    ToastModule,
    SlideMenuModule,
    ToolbarModule,
    NgxGaugeModule,
    ChartModule,
    ProgressBarModule,
    SidebarModule,
    OverlayPanelModule,
    InputNumberModule,
    InputTextModule,
    CardModule,
    RadioButtonModule
  ],
  declarations: [
    EqualValidator,
    layoutComponents,
    ChartComponent,
    IconCustomComponent,
    TableCalendarComponent,
    TableEditingCellComponent,
    InformationBarComponent,
    RadioButtonComponent
  ],
  exports: [layoutComponents],
  providers: [
    ReportDownloadService,
    MessageService,
    LanguageService
  ]
})
export class LayoutModule { }


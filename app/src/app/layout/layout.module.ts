import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonsModule } from '../commons/commons.module';
import { ApiModule } from '../api/api.module';
import { SharedModule } from '../shared/shared.module';

import { FocusComponent } from './focus/focus.component';
import { ContentComponent } from './content/content.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { FolderMenuComponent } from './sidebar/folder-menu/folder-menu.component';
import { LeafMenuComponent } from './sidebar/leaf-menu/leaf-menu.component';
import { ReportDownloadComponent } from './report-download/report-download.component';

import { ReportDownloadService } from '../api/report-download.service';

import { DataTableModule, ButtonModule, DialogModule } from 'primeng/primeng';
import { TableModule} from 'primeng/table';
import { ProgressSpinnerModule} from 'primeng/progressspinner';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EqualValidator } from '../commons/equal-validator.directive';
import { I18nModule } from 'app/i18n/i18n.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CommonsModule,
    ApiModule,
    SharedModule,
    NgbModule,
    DialogModule,
    DataTableModule,
    TableModule,
    ProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    I18nModule
  ],
  declarations: [
    FocusComponent,
    ContentComponent,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    FolderMenuComponent,
    LeafMenuComponent,
    ReportDownloadComponent,
    EqualValidator
  ],
  providers: [
    ReportDownloadService
  ]
})
export class LayoutModule { }


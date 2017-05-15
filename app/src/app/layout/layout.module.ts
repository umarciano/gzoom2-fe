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

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CommonsModule,
    ApiModule,
    SharedModule,
    NgbModule
  ],
  declarations: [
    FocusComponent,
    ContentComponent,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    FolderMenuComponent,
    LeafMenuComponent
  ]
})
export class LayoutModule { }

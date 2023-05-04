import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisRoutingModule } from './analysis-routing.module';
import { AnalysisResolver } from './analysis-resolver.service';

import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { LayoutModule } from 'app/layout/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiModule } from 'app/api/api.module';
import { CommonsModule } from 'app/commons/commons.module';
import { I18nModule } from 'app/i18n/i18n.module';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SpeedDialModule } from 'primeng/speeddial';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import { NgxGaugeModule } from 'ngx-gauge';
import { TargetComponent } from './target/target.component';
import { AnalysisListComponent } from './analysis-list/analysis-list.component';
import { TargetResolver } from './target/target-resolver.service';
import {TabViewModule} from 'primeng/tabview';
import { UomRangeValuesService } from 'app/api/service/uom-range-values.service';
import { ChartModule } from 'primeng/chart';
import { WorkEffortAnalysisService } from 'app/api/service/work-effort-analysis.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card'
import { GlAccountService } from 'app/api/service/gl-account.service';

@NgModule({
  imports: [
    
    AnalysisRoutingModule,
    
    

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CommonsModule,
    ApiModule,
    LayoutModule,
    
    AccordionModule,
    TreeTableModule,
    TableModule,
    DialogModule,
    SharedModule,
    ButtonModule,
    ConfirmDialogModule,
    SpinnerModule,
    ToastModule,
    DropdownModule,
    TooltipModule,
    I18nModule,
    ToolbarModule,
    TreeSelectModule,
    SpeedDialModule,
    SplitButtonModule,
    SlideMenuModule,
    RippleModule,
    MenuModule,
    NgxGaugeModule,
    TabViewModule,
    ChartModule,
    BreadcrumbModule,
    CardModule,      
  ],
  declarations: [
   
    TargetComponent,
    AnalysisListComponent,



  ],
  providers: [
    TargetResolver,
    AnalysisResolver,
    WorkEffortAnalysisService,
    ConfirmationService,
    UomRangeValuesService,
    GlAccountService
    
  ]
})
export class AnalysisModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TargetComponent } from './target/target.component';
import { TargetResolver } from './target/target-resolver.service';
import { AnalysisResolver } from './analysis-resolver.service';
import { AnalysisListComponent } from './analysis-list/analysis-list.component';




const routes: Routes = [

  { path: ':analysisId', component: TargetComponent, data: { breadcrumb: ':analysisId' }, resolve: { analyses: TargetResolver }, },
  { path: '', component: AnalysisListComponent, resolve: { analyses: AnalysisResolver }, }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisRoutingModule { }

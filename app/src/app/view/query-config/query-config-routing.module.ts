import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FocusComponent } from '../../layout/focus/focus.component';


import { QueryConfigComponent } from './query-config/query-config.component';
import { QueryConfigResolver } from './query-config/query-config-resolver.service';
import { QueryConfigIdResolver } from './query-config-details/query-config-id-resolver.service';
import { QueryConfigDetailsComponent } from './query-config-details/query-config-details.component';

const routes: Routes = [

  { path: '', component: QueryConfigComponent, resolve: { queryConfigs: QueryConfigResolver},
    children: [
      { path: ':id', component: QueryConfigDetailsComponent, resolve: { queryConfigs: QueryConfigIdResolver}}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueryConfigRoutingModule { }

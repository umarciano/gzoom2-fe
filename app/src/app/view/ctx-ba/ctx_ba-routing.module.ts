import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TypologyRelationshipsObjectivesComponent } from './typology-relationships-objectives/typology-relationships-objectives.component';
import { TypologyRelationshipsObjectivesResolver } from './typology-relationships-objectives/typology-relationships-objectives-resolver.service';
import { TypologyRelationshipsObjectivesModule } from './typology-relationships-objectives/typology-relationships-objectives.module';
import { CanDeactivateGuard } from 'app/shared/can-deactivate.guard';
import { ObjectiveCodesComponent } from './objective-codes/objective-codes.component';
import { ObjectiveCodesResolver } from './objective-codes/objective-codes-resolver.service';
import { ObjectiveCodesModule } from './objective-codes/objective-codes.module';
import { SubsystemTypesComponent } from './subsystem-types/subsystem-types.component';
import { SubsystemTypesResolver } from './subsystem-types/subsystem-types-resolver.service';
import { SubsystemTypesModule } from './subsystem-types/subsystem-types.module';
import { DetectionTypeComponent } from './detection-type/detection-type.component';
import { DetectionTypeResolver } from './detection-type/detection-type-resolver.service';
import { DetectionTypeModule } from './detection-type/detection-typet.module';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: 'uom', loadChildren: () => import('../ctx-ba/uom/uom.module').then(m => m.UomModule), data: { breadcrumb: 'Uom' } },
            { path: 'visitor', loadChildren: () => import('./visitor/visitor.module').then(m => m.VisitorModule), data: { breadcrumb: 'Visitor' } },
            { path: 'queryconfig', loadChildren: () => import('../query-config/query-config.module').then(m => m.QueryConfigModule), data: { breadcrumb: 'Esecutore-Query' } },
            { path: 'interfacciamentoDati', loadChildren: () => import('./interfacciamento-dati/interfacciamento-dati.module').then(m => m.InterfacciamentoDatiModule), data: { breadcrumb: 'Interfacciamento Dati' } },
            { path: 'periodType', loadChildren: () => import('./period-type/period-type.module').then(m => m.PeriodTypeModule), data: { breadcrumb: 'Periodicità' } },
            { path: 'typology-relationships-objectives', loadChildren: () => import('./typology-relationships-objectives/typology-relationships-objectives.module').then(m => m.TypologyRelationshipsObjectivesModule), 
              component: TypologyRelationshipsObjectivesComponent, 
              resolve: { weats: TypologyRelationshipsObjectivesResolver}, 
              data: { breadcrumb: 'Typologies Relationships Objectives' },
              canDeactivate: [CanDeactivateGuard]
            },
            { path: 'objective-codes', loadChildren: () => import('./objective-codes/objective-codes.module').then(m => m.ObjectiveCodesModule), 
              component: ObjectiveCodesComponent, 
              resolve: { objCod: ObjectiveCodesResolver}, 
              data: { breadcrumb: 'Objective Codes' },
              canDeactivate: [CanDeactivateGuard]
            },
            { path: 'subsystem-types', loadChildren: () => import('./subsystem-types/subsystem-types.module').then(m => m.SubsystemTypesModule), 
              component: SubsystemTypesComponent, 
              resolve: { dsts: SubsystemTypesResolver}, 
              data: { breadcrumb: 'Subsystem Types' },
              canDeactivate: [CanDeactivateGuard]
            },
            { path: 'detection-type', loadChildren: () => import('./detection-type/detection-typet.module').then(m => m.DetectionTypeModule), 
              component: DetectionTypeComponent, 
              resolve: { obss: DetectionTypeResolver}, 
              data: { breadcrumb: 'Detection Type' },
              canDeactivate: [CanDeactivateGuard]
            },

            { path: '', pathMatch: 'full', redirectTo: '/c/dashboard' }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        TypologyRelationshipsObjectivesModule,
        ObjectiveCodesModule,
        SubsystemTypesModule,
        DetectionTypeModule
    ],
    providers: [],
    exports: [RouterModule]
})
export class ctx_baRoutingModule { }

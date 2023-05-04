import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { LockoutService } from '../../../commons/service/lockout.service';
import { WorkEffortAssocType } from 'app/api/model/workEffortAssocType';
import { WorkEffortAssocTypeService } from 'app/api/service/work-effort-assoc-type.service';

@Injectable()
export class TypologyRelationshipsObjectivesResolver implements Resolve<void | WorkEffortAssocType[]> {
    constructor( 
        private readonly workEffortAssocTypeService: WorkEffortAssocTypeService,
        private readonly lockoutService: LockoutService
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void | WorkEffortAssocType[] | Observable<void | WorkEffortAssocType[]> | Promise<void | WorkEffortAssocType[]> {
        console.log('resolve TypologyRelationshipObjectives');

        const weat$ = this.workEffortAssocTypeService.getWorkEffortAssocType();
        return lastValueFrom(weat$).then(weats => {return weats;})
        .catch(err => {
            console.error('Cannot retrieve workEffortAssocType', err);
            this.lockoutService.lockout();
        });  
    }
}
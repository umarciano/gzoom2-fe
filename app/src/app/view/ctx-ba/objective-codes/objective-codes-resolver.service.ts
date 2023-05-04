import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { LockoutService } from '../../../commons/service/lockout.service';
import { WorkEffortSequenceService } from 'app/api/service/work-effort-sequence.service';
import { WorkEffortSequence } from 'app/api/model/workEffortSequence';

@Injectable()
export class ObjectiveCodesResolver implements Resolve<void | WorkEffortSequence[]> {
    constructor( 
        private readonly workEffortSequenceService: WorkEffortSequenceService,
        private readonly lockoutService: LockoutService
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void | WorkEffortSequence[] | Observable<void | WorkEffortSequence[]> | Promise<void | WorkEffortSequence[]> {
        console.log('resolve ObjectiveCodes');

        const objCod$ = this.workEffortSequenceService.getWorkEffortSequence();
        return lastValueFrom(objCod$).then(objCod => {return objCod;})
        .catch(err => {
            console.error('Cannot retrieve ObjectiveCodes', err);
            this.lockoutService.lockout();
        });  
    }
}
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { LockoutService } from '../../../commons/service/lockout.service';
import { GlFiscalTypeEx } from 'app/api/model/glFiscalTypeEx';
import { GlFiscalTypeService } from 'app/api/service/gl-fiscal-type.service';

@Injectable()
export class DetectionTypeResolver implements Resolve<void | GlFiscalTypeEx[]> {
    constructor( 
        private readonly glAccountTypeService: GlFiscalTypeService,
        private readonly lockoutService: LockoutService
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void | GlFiscalTypeEx[] | Observable<void | GlFiscalTypeEx[]> | Promise<void | GlFiscalTypeEx[]> {
        console.log('resolve DetectionType');

        const obs$ = this.glAccountTypeService.getDetectionType();
        return lastValueFrom(obs$).then(obss => {return obss;})
        .catch(err => {
            console.error('Cannot retrieve DetectionType', err);
            this.lockoutService.lockout();
        });  
    }
}
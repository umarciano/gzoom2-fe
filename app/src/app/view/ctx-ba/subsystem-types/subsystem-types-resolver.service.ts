import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { LockoutService } from '../../../commons/service/lockout.service';
import { DataSourceType } from 'app/api/model/dataSourceType';
import { DataSourceTypeService } from 'app/api/service/dataSourceType.service';

@Injectable()
export class SubsystemTypesResolver implements Resolve<void | DataSourceType[]> {
    constructor( 
        private readonly dataSourceTypeService: DataSourceTypeService,
        private readonly lockoutService: LockoutService
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void | DataSourceType[] | Observable<void | DataSourceType[]> | Promise<void | DataSourceType[]> {
        console.log('resolve SubsystemTypes');

        const dst$ = this.dataSourceTypeService.getDataSourceType();
        return lastValueFrom(dst$).then(dsts => {console.log(dsts);return dsts;})
        .catch(err => {
            console.error('Cannot retrieve dataSourceType', err);
            this.lockoutService.lockout();
        });  
    }
}
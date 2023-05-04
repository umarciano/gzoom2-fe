import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';


import { LockoutService } from '../../../commons/service/lockout.service';
import { RoleTypeService } from '../../../api/service/role-type.service';
import { RoleType } from './role-type';

@Injectable()
export class RoleTypeResolverService {

  
  constructor(
    private readonly roleTypeService: RoleTypeService,
    private readonly lockoutService: LockoutService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | RoleType[]> {
    console.log('resolve Role Type');

    const roleTypeService$ = this.roleTypeService.roleTypes();
    return lastValueFrom(roleTypeService$).then(roleTypes => { return roleTypes; })
    .catch(err => { 
      console.error('Cannot retrieve roleType', err);
      this.lockoutService.lockout();
    });

    // return this.roleTypeService
    //   .roleTypes()
    //   .toPromise()
    //   .then(roleTypes => { return roleTypes; })
    //   .catch(err => { 
    //     console.error('Cannot retrieve roleType', err);
    //     this.lockoutService.lockout();
    //   });
  }

}

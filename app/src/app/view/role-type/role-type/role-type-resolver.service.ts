import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';


import { LockoutService } from '../../../commons/lockout.service';
import { RoleTypeService } from '../../../api/role-type.service';
import { RoleType } from './role-type';

@Injectable()
export class RoleTypeResolverService {

  
  constructor(
    private readonly roleTypeService: RoleTypeService,
    private readonly lockoutService: LockoutService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | RoleType[]> {
    console.log('resolve Role Type');
    return this.roleTypeService
      .roleTypes()
      .toPromise()
      .then(roleTypes => { return roleTypes; })
      .catch(err => { 
        console.error('Cannot retrieve roleType', err);
        this.lockoutService.lockout();
      });
  }

}

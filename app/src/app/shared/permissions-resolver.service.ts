import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { Permissions } from '../api/dto';
import { AccountService } from '../api/account.service';
import { LockoutService } from '../commons/lockout.service';
import { AuthorizationService } from '../shared/authorization.service';

@Injectable()
export class PermissionsResolver implements Resolve<Permissions> {

  constructor(
    private readonly accountService: AccountService,
    private readonly authorService: AuthorizationService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Permissions> {
    return this.accountService
      .permissions()
      .toPromise()
      .then(perms => {
        this.authorService.setPermissions(perms);
        return perms;
      })
      .catch(err => {
        console.error("An error occurred while loading account permissions", err);
        this.lockoutService.lockout();
      });
  }
}

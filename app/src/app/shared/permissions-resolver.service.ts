import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';


import { Permissions } from '../commons/model/dto';
import { AccountService } from '../commons/service/account.service';
import { LockoutService } from '../commons/service/lockout.service';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class PermissionsResolver implements Resolve<void | boolean> {

  constructor(
    private readonly accountService: AccountService,
    private readonly authorService: AuthorizationService,
    private readonly lockoutService: LockoutService) {

    // subscribe to lockout event in order to clean
    this.lockoutService.events.subscribe(() => {
      this.authorService.clear();
    });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<void | boolean> {
    if (this.authorService.isInitialized()) {
      return true;
    }

    const accountService$ = this.accountService.permissions();
    return lastValueFrom(accountService$).then(perms => {
      this.authorService.init(perms);
      return true;
    })
    .catch(err => {
      console.error('An error occurred while loading account permissions', err);
      this.lockoutService.lockout();
    });


    // return this.accountService
    //   .permissions()
    //   .toPromise()
    //   .then(perms => {
    //     this.authorService.init(perms);
    //     return true;
    //   })
    //   .catch(err => {
    //     console.error('An error occurred while loading account permissions', err);
    //     this.lockoutService.lockout();
    //   });
  }
}

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';


import { LockoutService } from '../commons/service/lockout.service';
import { MenuService } from '../commons/service/menu.service';
import { RootMenu } from '../commons/model/dto';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class MenuResolver implements Resolve<void | RootMenu> {

  constructor(
    private readonly menuService: MenuService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | RootMenu> {

    const menuService$ = this.menuService.menu();
    return lastValueFrom(menuService$).then(root => { return root; })
      .catch(err => {
        console.error('Cannot retrieve menu', err);
        this.lockoutService.lockout();
      });
    // return this.menuService
    //   .menu()
    //   .toPromise()
    //   .then(root => { return root; })
    //   .catch(err => {
    //     console.error('Cannot retrieve menu', err);
    //     this.lockoutService.lockout();
    //   });
  }
}

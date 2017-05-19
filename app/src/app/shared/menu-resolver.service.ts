import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { LockoutService } from '../commons/lockout.service';
import { MenuService } from '../api/menu.service';
import { RootMenu } from '../api/dto';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class MenuResolver implements Resolve<RootMenu> {

  constructor(
    private readonly menuService: MenuService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<RootMenu> {
    return this.menuService
      .menu()
      .toPromise()
      .then(root => {
        //console.log('Menu successfully retrieved', root);
        return root;
      })
      .catch(err => {
        console.error('Cannot retrieve menu', err);
        this.lockoutService.lockout();
      });
  }
}

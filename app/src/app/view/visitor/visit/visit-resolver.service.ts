import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';


import { LockoutService } from '../../../commons/lockout.service';
import { VisitorService } from '../../../api/visitor.service';
import { Visit } from './visit';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class VisitResolver implements Resolve<void | Visit[]> {

  constructor(
    private readonly visitorService: VisitorService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | Visit[]> {
    console.log('resolve Visit');
    return this.visitorService
      .visits()
      .toPromise()
      .then(visitors => { return visitors; })
      .catch(err => { // TODO devo fare il lockout?
        console.error('Cannot retrieve visit', err);
        this.lockoutService.lockout(); // TODO cos'e?
      });
  }
}

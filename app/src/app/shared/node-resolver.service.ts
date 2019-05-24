import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';


import { LockoutService } from '../commons/lockout.service';
import { NodeService } from './node.service';
import { Node } from '../view/node/node';

/**
 * Retrieves the menus to be shown or locks the user out if something wrong happens.
 */
@Injectable()
export class NodeResolver implements Resolve<void | Node> {

  constructor(
    private readonly nodeService: NodeService,
    private readonly lockoutService: LockoutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void | Node> {
    console.log('resolve node');
    return this.nodeService
      .node("Company")
      .toPromise()
      .then(node => { return node; })
      .catch(err => {
        console.error('Cannot retrieve node', err);
        //this.lockoutService.lockout(); cancella tutta la sessione e ti rimanda all'homepage
      });
  }
}

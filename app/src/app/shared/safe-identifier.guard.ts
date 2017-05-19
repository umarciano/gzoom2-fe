import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

const ID_REGEXP = /^[0-9a-zA-Z\._\-]+$/;

/**
 * Creates a safety guard that prevents routes to be loaded when the id parameter does not
 * match the safe-id regular expression.
 * Such ids cannot contain paranthesis and colons; the only valid characters are digits,
 * alphabetic ascii, dots, dashes and underscores.
 */
@Injectable()
export class SafeIdentifierGuard implements CanActivate {

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const id = next.params['id'] as string;
    return id && ID_REGEXP.test(id);
  }
}

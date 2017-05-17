import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SafeIdentifierGuard implements CanActivate {
  private readonly regExp = /^[0-9a-zA-Z\.\-]+$/.compile();

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const id = next.params['id'] as string;
    return id && this.isSafe(id);
  }

  isSafe(id: string) {
    return this.regExp.test(id);
  }
}

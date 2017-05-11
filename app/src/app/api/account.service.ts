import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiClientService } from './client.service';
import { Permissions } from './dto';

const PERMISSIONS_ENDPOINT = 'account/permissions';

/**
 * API service that dials with accounts of logged in user.
 */
@Injectable()
export class AccountService {

  constructor(private readonly client: ApiClientService) { }

  /**
   * Retrieves permissions of a user.
   *
   * @return {Observable<Permissions>} An observable set of permissions.
   */
  permissions(): Observable<Permissions> {
    return this.client.get(PERMISSIONS_ENDPOINT);
  }
}

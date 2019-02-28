import { Injectable } from '@angular/core';
import { ApiClientService } from './client.service';



const LOGOUT_ENDPOINT = 'logout';

/**
 * Allows user to log out.
 */
@Injectable()
export class LogoutService {
  constructor(private readonly client: ApiClientService) { }

  /**
   * Logs user out. This method is never supposed to fail even if calls to backend
   * service returns an error.
   *
   * @return {Promise<any>} A promise of any result that always succeeds.
   */
  logout(): Promise<any> {
    return this.client
      .post(LOGOUT_ENDPOINT)
      .toPromise()
      .catch(err => err);
  }
}

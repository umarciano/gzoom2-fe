import { Injectable } from '@angular/core';
import { ApiClientService } from './client.service';

import 'rxjs/add/operator/toPromise';

const LOGOUT_ENDPOINT = 'logout';

@Injectable()
export class LogoutService {
  constructor(private readonly client: ApiClientService) { }

  logout(): Promise<any> {
    return this.client
      .post(LOGOUT_ENDPOINT)
      .toPromise()
      .catch(err => err);
  }
}

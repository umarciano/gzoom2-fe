import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiClientService } from './client.service';
import { RootMenu } from './dto';

const MENU_ENDPOINT = 'menu';

/**
 * API service that operates on menus.
 */
@Injectable()
export class MenuService {

  constructor(private readonly client: ApiClientService) { }

  menu(): Observable<RootMenu> {
    return this.client.get(MENU_ENDPOINT);
  }
}

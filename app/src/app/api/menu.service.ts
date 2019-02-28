import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './client.service';
import { RootMenu } from './dto';

const MENU_ENDPOINT = 'menu';

/**
 * API service that operates on menus.
 */
@Injectable()
export class MenuService {

  constructor(private readonly client: ApiClientService) { }

  menu(): Observable<void | RootMenu> {
    return this.client.get(MENU_ENDPOINT);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './client.service';
import { RootMenu } from '../model/dto';
import { map } from 'rxjs/operators';

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

  getHelpId(contentIdTo: string){
    return this.client.get('/help/' + contentIdTo).pipe(
      map(json => json as string)
    );
  }

  getMenuPath(contentIdTo: string): Observable<string> {
    return this.client.get(`${MENU_ENDPOINT}/getpath/${contentIdTo}`).pipe(
      map(path => path as string)
    );
  }
}

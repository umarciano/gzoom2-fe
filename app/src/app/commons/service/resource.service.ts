import { Injectable } from '@angular/core';
import { ApiConfig } from '../model/api-config';
import { AuthService, UserProfile } from './auth.service';

@Injectable()
export class ResourceService {

  constructor(
    private readonly apiConfig: ApiConfig,
    private readonly authService: AuthService) { }

  iframeUrl(menuId: string) {
    const usr = this.authService.userProfile();

    return `${this.apiConfig.gzoomPath}?menuId=${menuId}&externalLoginKey=${usr.externalLoginKey}`;
  }
}

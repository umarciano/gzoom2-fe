import { Injectable } from '@angular/core';
import { ApiConfig } from './api-config';
import { AuthService, UserProfile } from '../commons/auth.service';

@Injectable()
export class ResourceService {

  constructor(
    private readonly apiConfig: ApiConfig,
    private readonly authService: AuthService) { }

  iframeUrl(menuId: string) {
    const usr = this.authService.userProfile();
    // console.log(`iframe url:${this.apiConfig.legacyPath + '/' + menuId}`);
    return `${this.apiConfig.legacyPath}/${menuId}?externalLoginKey=${usr.externalLoginKey}`;
  }
}

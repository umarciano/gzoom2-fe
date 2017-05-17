import { Injectable } from '@angular/core';
import { ApiConfig } from './api-config';

@Injectable()
export class ResourceService {

  constructor(private apiConfig: ApiConfig) { }

  iframeUrl(menuId: string) {
    // console.log(`iframe url:${this.apiConfig.legacyPath + '/' + menuId}`);
    return this.apiConfig.legacyPath + '/' + menuId;
  }
}

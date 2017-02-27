import { Headers } from '@angular/http';

export const HTTP_HEADERS = new Headers({ 'Content-Type': 'application/json' });

const DEF_API_ROOT_PATH = '../rest';

export class ApiConfig {
  readonly rootPath: string = DEF_API_ROOT_PATH;
}

export const DEF_API_CONFIG: ApiConfig = new ApiConfig();

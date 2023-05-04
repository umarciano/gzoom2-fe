import { Injectable } from '@angular/core';
import { AuthService } from 'app/commons/service/auth.service';
import { I18NService } from 'app/i18n/i18n.service';
import { lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiClientService } from '../../commons/service/client.service';

@Injectable()
export class LanguageService {

  languages: string[] = [];

  constructor(private client: ApiClientService,
    private readonly authService: AuthService,
    public readonly i18nService: I18NService) { }

  language(){
    
    
    return this.client.get('/profile/i18n/languages').pipe(
      map(json => json.results as string[])
    );    
  }

  async secondaryLang(): Promise<boolean> {

    const client$ = this.client.get("/profile/i18n/languages").pipe(map( json => json.results as string[]));
    this.languages = await lastValueFrom(client$);

    if(this.languages.length > 1 && this.languages[1].indexOf(this.i18nService.getLang()) >= 0) {
      return true;
    }

    return false;
  }


}

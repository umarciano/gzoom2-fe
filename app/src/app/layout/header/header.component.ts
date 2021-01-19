import { map } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { AuthService, UserProfile } from '../../commons/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LockoutService } from '../../commons/lockout.service';
import { LogoutService } from '../../api/logout.service';
import { LoginService } from '../../api/login.service';
import { UserPreference } from '../../api/login.service';
import {DropdownModule} from 'primeng/dropdown';
import { NodeService } from '../../shared/node.service';

import { ApiConfig } from '../../api/api-config';

import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { DialogModule } from 'primeng/primeng';

import { I18NService } from '../../i18n/i18n.service';
import { Message } from '../../commons/message';
import { Node } from '../../view/node/node';
import { ApiClientService } from 'app/api/client.service';

const CHANGE_PASS_ENDPOINT = 'change-password';
const CHANGE_LANG_ENDPOINT = 'change-language';
const HTTP_HEADERS = new HttpHeaders();

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user: UserProfile;
  node: Node;
  legacyAppVersions: String;
  restVersions: String;
  displayChangePassword: boolean = false;
  displayChangeTheme: boolean  = false;
  form: FormGroup;
  error = '';

  msgs: Message[] = [];
  languages: String[] = [];
  currentPassword: String;
  newPassword: String;
  newPasswordVerify: String;

  private readonly changePassUrl: string;
  private readonly changeLangUrl: string;

  THEME_GREEN: String = 'GPLUS_GREEN_ACC';
  THEME_BLUE: String = 'GPLUS_BLUE_ACC';
  THEME_VIOLET: String = 'GPLUS_VIOLET_ACC';
  userPreference: UserPreference = new UserPreference();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private readonly authSrv: AuthService,
              private readonly lockoutSrv: LockoutService,
              private readonly logoutSrv: LogoutService,
              private readonly loginSrv: LoginService,
              private readonly nodeService: NodeService,
              private readonly i18nService: I18NService,
              private http: HttpClient,
              private apiConfig: ApiConfig,
              private authService: AuthService,
              private fb: FormBuilder,
              private client: ApiClientService
              ) {
    this.user = authSrv.userProfile();
    this.changeTheme(this.user.userPrefValue);
    this.changePassUrl = `${apiConfig.rootPath}/${CHANGE_PASS_ENDPOINT}`;
    this.changeLangUrl = `${apiConfig.rootPath}/${CHANGE_LANG_ENDPOINT}`;
  }

  ngOnInit() {
    this.route.data.pipe(
      map((data: { node: Node }) => data.node),
    ).subscribe((data) => {
      this.node = data;
    });


    this.client.get("/profile/i18n/languages").subscribe( json => {
      this.languages = json.results as String[];
      console.log("languages available "+this.languages);
    });

    this.form = this.fb.group({
      'currentPassword': new FormControl('', Validators.required),
      'newPassword': new FormControl('', Validators.required),
      'newPasswordVerify': new FormControl('', Validators.required)
    });

    this.displayChangePassword = false;
    this.displayChangeTheme = false;

    this.nodeService.nodeLegacyVersions().subscribe(
      (legacyVersions: string) => {
        this.legacyAppVersions = legacyVersions;
      }
    );

    this.nodeService.nodeRestVersions().subscribe(
      (restVersions: string) => {
        this.restVersions = restVersions;
      }
    );
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    const menu: any = document.querySelector('#sidebar');
    if (menu.classList.contains('collapse')) {
      dom.classList.remove('push-right');
    } else {
      dom.classList.add('push-right');
    }
    menu.classList.toggle('collapse');
  }

  logout() {
    this.logoutSrv.logout().then(() => {
      this.lockoutSrv.lockout();
    });
  }

  changePasswordDialog() {
    this.displayChangePassword = true;
  }

  changeThemeDialog() {
    this.displayChangeTheme = true;
  }

  changeTheme(theme) {
    window['switchStyle'](theme);
    localStorage.setItem('app-root', theme);
    console.log('theme=' + theme);
    this.displayChangeTheme = false;
    this.router.navigate(['/c/dashboard']);
  }

  saveChangeTheme(theme) {

    this.userPreference.userLoginId = this.user.username;
    this.userPreference.userPrefTypeId = "VISUAL_THEME";
    this.userPreference.userPrefValue = theme;
    this.loginSrv
      .updateUserPreference(this.userPreference)
      .then(() => {
        this.changeTheme(theme);
      })
      .catch((error) => {
        console.log('error.message' , error);
        this.error = this.i18nService.translate(error) || error;
      });

  }

  changePassword() {
    const body = JSON.stringify({ username: this.user.username, password: this.currentPassword, newPassword: this.newPassword });
    this.http
      .post(this.changePassUrl, body, {
              headers: HTTP_HEADERS.set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + this.authService.token()),
      }).subscribe(
        (data: any) => {
            console.log("-changePass " + data);
        },
        err => {
            console.log("error changePass",err);
            this.error = this.i18nService.translate(err.message) || err.message;
        }, // error
        () => {
          console.log('change password Complete');
          this.displayChangePassword = false;
          this.currentPassword = "";
          this.newPassword = "";
          this.newPasswordVerify = "";
          this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Change password'), detail:this.i18nService.translate('Cambio password eseguito con successo ')}];
      }); // complete
  }

  changeLang(lang: String) {
    const body = JSON.stringify({ username: this.user.username, lang: lang});
    this.client.post(this.changeLangUrl,body)
      .subscribe((data:any) => {
        console.log("change language:" + data);
        window.location.reload();
      },
      err => {
        console.log("error change language",err);
      });
  }
}

import { map, mergeMap, filter, distinctUntilChanged } from 'rxjs/operators';
import { lastValueFrom, of } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { AuthService, UserProfile } from '../../commons/service/auth.service';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { LockoutService } from '../../commons/service/lockout.service';
import { LogoutService } from '../../commons/service/logout.service';
import { LoginService } from '../../commons/service/login.service';
import { ChangePasswordService } from '../../shared/change-password/change-password.service';
import { ChangePasswordComponent } from '../../shared/change-password/change-password.component';
import { UserPreferenceService } from '../../api/service/user-preference.service';
import { UserPreference } from '../../shared/user-preference';
import { NodeService } from '../../shared/node.service';
import { SelectItem } from '../../commons/model/selectitem';

import { ApiConfig } from '../../commons/model/api-config';

import { I18NService } from '../../i18n/i18n.service';
import { Message } from '../../commons/model/message';
import { Node } from '../../view/node/node';
import { ApiClientService } from 'app/commons/service/client.service';
import { UserLoginValidPartyRole } from 'app/api/model/userLoginValidPartyRole';
import { MenuService } from 'app/commons/service/menu.service';
import { Title } from '@angular/platform-browser';

const CHANGE_PASS_ENDPOINT = 'change-password';
const CHANGE_LANG_ENDPOINT = 'change-language';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: UserProfile;
  node: Node;
  legacyAppVersions: String;
  restVersions: String;
  displayChangePassword = false;
  displayChangeTheme = false;
  error = '';
  langType: string;
  organizationType: string;
  organizations: UserLoginValidPartyRole[];
  organizationSelectItem: SelectItem[] = [];
  organizationSelected = 'Company';

  allowChangePassword: boolean = true;

  msgs: Message[] = [];
  languages: String[] = [];
  currentPassword: String;
  newPassword: String;
  newPasswordVerify: String;
  serverUrl: string;
  urlParam = 'GP_HOMEPAGE';

  private readonly changePassUrl: string;
  private readonly changeLangUrl: string;

  THEME_GREEN: String = 'GPLUS_GREEN_ACC';
  THEME_BLUE: String = 'GPLUS_BLUE_ACC';
  THEME_VIOLET: String = 'GPLUS_VIOLET_ACC';
  THEME_BLUE_LIGHT: String = "GPLUS_BLUE_LIGHT";
  THEME_GREEN_LIGHT: String = "GPLUS_GREEN_LIGHT";
  THEME_VIOLET_LIGHT: String = "GPLUS_VIOLET_LIGHT";
  THEME_HIGH_CONTRAST: String = "GPLUS_HIGH_CONTRAST";

  userPreference: UserPreference = new UserPreference();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private readonly authSrv: AuthService,
              private readonly lockoutSrv: LockoutService,
              private readonly logoutSrv: LogoutService,
              private readonly userPreferenceService: UserPreferenceService,
              private readonly nodeService: NodeService,
              private readonly i18nService: I18NService,
              private readonly loginService: LoginService,
               private readonly changePasswordService: ChangePasswordService,
               private readonly changePasswordComponent: ChangePasswordComponent,
              private http: HttpClient,
              private apiConfig: ApiConfig,
              private authService: AuthService,
              private client: ApiClientService,
              private menuService: MenuService,
              private titleService: Title
              ) {
    this.user = authSrv.userProfile();

    this.changePassUrl = `${apiConfig.rootPath}/${CHANGE_PASS_ENDPOINT}`;
    this.changeLangUrl = `${apiConfig.rootPath}/${CHANGE_LANG_ENDPOINT}`;
  }

  ngOnInit() {
    this.route.data.pipe(
      map((data: { node: Node }) => data.node),
    ).subscribe((data) => {
      this.node = data;
    });

    this.route.data.pipe(
      map((data: { theme: UserPreference }) => data.theme),
    ).subscribe((data) => {
      this.userPreference = data;
      this.setTheme(this.userPreference.userPrefValue);
    });


    this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd),
      distinctUntilChanged()
    ).subscribe( data => {
      this.urlParam = data['url'];
      this.urlParam = this.urlParam && this.urlParam.indexOf('legacy')>0?this.urlParam.substr(this.urlParam.lastIndexOf('/')+1,this.urlParam.length):'GP_HOMEPAGE';
    });

    this.langType = this.i18nService.getLanguageType();
    this.client.get('/profile/i18n/languages').subscribe( json => {
      this.languages = json.results as String[];
      console.log('languages available ' + this.languages);
    });

    this.userPreferenceService.getUserPreference('ORGANIZATION_PARTY').subscribe(
      data => {
        console.log('data.userPrefValue:' + data.userPrefValue);
        if (data.userPrefValue && data.userPrefValue !== 'DEFAULT') {
          this.organizationSelected = data.userPrefValue;
        }

        console.log('organizationSelected:' + this.organizationSelected);
       }
    );

    this.userPreferenceService.getOrganizationMultiType().subscribe(
      data => {this.organizationType = data;
      console.log('Organization type: ' + this.organizationType);
    });

    this.nodeService.nodeXmlRcpUrl().subscribe(
      data => {this.serverUrl = data.substring(0,data.indexOf('/gzoom'));
      console.log('Server URL: '+this.serverUrl)}
    )

    const organizationsReload = this.userPreferenceService.getOrganizations()
    .subscribe(
      data => {
        this.organizationSelectItem = this.organization2SelectItems(data);

        //setting title browser tab by organization selected
        let title = this.organizationSelectItem.find(item =>
          item.value === this.organizationSelected
        );
        this.titleService.setTitle(title.label);
      }
    );


    const loginService$ = this.loginService.getUserLogin();
    const usr = lastValueFrom(loginService$).then(
      userLogin => {
        if(userLogin) {
          if (userLogin.requirePasswordChange)
            this.changePasswordService.openPopup(userLogin);
        }
      });

    // const usr = this.loginService.getUserLogin().toPromise().then(
    //   userLogin => {
    //     if(userLogin) {
    //       if (userLogin.requirePasswordChange)
    //         this.changePasswordService.openPopup(userLogin);
    //     }
    //   });

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

    //request enableChangePassword for show/hide the changePassword button
    this.client.get('/api/getEnableChangePassword').subscribe(
      (boolResponse: boolean)  => this.allowChangePassword = boolResponse,
      (err) => console.log(err)
    )
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

      //TODO logout SSO

      this.http.get('/rest/api/getLoginMethod').subscribe(
        (data: any) => {
            console.log('login method : ' + data);
            if(data == 'OneLogin')
            {
              this.http.get('/rest/api/getOneLogin-LogoutUrl').subscribe(
                (url: any) => {
                    console.log('OneLogin-LogoutUrl : ' + url);
                    window.location.href = url;
                  },
                err => console.log(err) // error
                );
            }
          },
        err => console.log(err) // error
        );
    });
  }

  changePasswordDialog() {



    const loginService$ = this.loginService.getUserLogin();
    const usr = lastValueFrom(loginService$).then(
      userLogin => {
        if(userLogin) {
          this.changePasswordService.openPopup(userLogin);
        }
      });

    // const usr = this.loginService.getUserLogin().toPromise().then(
    //   userLogin => {
    //     if(userLogin) {
    //       this.changePasswordService.openPopup(userLogin);
    //     }
    //   });
  }

  changeThemeDialog() {
    this.displayChangeTheme = true;
  }

  setTheme(theme) {
    window['switchStyle'](theme);
    this.displayChangeTheme = false;
  }

  openHelp() {
    console.log('Open help');
    this.menuService.getHelpId(this.urlParam).subscribe((data: string) => {
      window.open(`${this.serverUrl}/help/content/${data.substring(data.indexOf("_")+1)}.htm`,'_blank').focus();
    });
  }

  setOrganization() {
    console.log('setOrganization: ' + this.organizationSelected);
    const newOrganization: UserPreference = new UserPreference();
    newOrganization.userPrefValue = this.organizationSelected;
    newOrganization.userPrefTypeId = 'ORGANIZATION_PARTY';
    this.userPreferenceService.updateUserPreference(newOrganization)
      .then(() => window.location.reload())
      .catch((error) => {
        console.log('ERROR setOrganization', error);
        this.error = this.i18nService.translate(error) || error;
      })
  }

  saveChangeTheme(theme) {
    this.userPreference.userPrefTypeId = 'VISUAL_THEME';
    this.userPreference.userPrefValue = theme;
    this.userPreferenceService
      .updateUserPreference(this.userPreference)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log('error.message' , error);
        this.error = this.i18nService.translate(error) || error;
      });
  }

  changeLang(lang: String) {
    const body = JSON.stringify({ username: this.user.username, externalLoginKey: this.user.externalLoginKey, lang: lang});
    this.client.post(this.changeLangUrl, body)
      .subscribe((data: any) => {
        console.log('change language:' + data);
        window.location.reload();
      },
      err => {
        console.log('error change language', err);
      });
  }


  organization2SelectItems(organization: UserLoginValidPartyRole[]): SelectItem[] {
    if (organization == null) {
      return [];
    }
    return _.map(organization['results'], u => {
      let label = u.partyGroup.groupName;
      if (this.languages.length > 1 && this.languages[1].indexOf(this.i18nService.getLang()) >= 0) {
        label = u.partyGroup.groupNameLang;
      }
      return {
        label: label, value: u.partyId
      };
    });
  }
}

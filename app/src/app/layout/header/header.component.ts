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

import { ApiConfig } from '../../api/api-config';

import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { DialogModule } from 'primeng/primeng';

import { I18NService } from '../../commons/i18n.service';
import { Message } from '../../commons/message';


const CHANGE_PASS_ENDPOINT = 'change-password';
const HTTP_HEADERS = new HttpHeaders();

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user: UserProfile;
  node: Node;

  displayChangePassword: boolean = false;
  displayChangeTheme: boolean  = false;
  form: FormGroup;
  error = '';

  msgs: Message[] = [];
  
  currentPassword: String;
  newPassword: String;
  newPasswordVerify: String;

  private readonly changePassUrl: string;

  THEME_GREEN: String = 'GPLUS_GREEN_ACC';
  THEME_BLUE: String = 'GPLUS_BLUE_ACC';
  THEME_VIOLET: String = 'GPLUS_VIOLET_ACC'; 
  userPreference: UserPreference = new UserPreference();         

  constructor(private route: ActivatedRoute,
              private readonly authSrv: AuthService,
              private readonly lockoutSrv: LockoutService,
              private readonly logoutSrv: LogoutService,
              private readonly loginSrv: LoginService,
              private readonly i18nService: I18NService,
              private http: HttpClient,
              private apiConfig: ApiConfig,
              private authService: AuthService,
              private fb: FormBuilder) {
    this.user = authSrv.userProfile();
    this.changeTheme(this.user.userPrefValue);
    this.changePassUrl = `${apiConfig.rootPath}/${CHANGE_PASS_ENDPOINT}`;
  }

  ngOnInit() {
    this.route.data.pipe(
      map((data: { node: Node }) => data.node),
    ).subscribe((data) => {
      this.node = data;
      });

    this.form = this.fb.group({
      'currentPassword': new FormControl('', Validators.required),
      'newPassword': new FormControl('', Validators.required),
      'newPasswordVerify': new FormControl('', Validators.required)
    });

    this.displayChangePassword = false;
    this.displayChangeTheme = false;
   
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('push-right');
    const menu: any = document.querySelector('#sidebar');
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
    console.log("changePassword");   
    //this.loginSrv
     // .changePassword( this.user.username, this.currentPassword, this.newPassword );
      /*
      .then(() => {
        this.displayChangePassword = false; 
        this.currentPassword = "";
        this.newPassword = "";
        this.newPasswordVerify = "";
        this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Change password'), detail:this.i18nService.translate('Cambio password eseguito con successo ')}];         
      })     
      .catch((error) => {
        console.log('error' , error.message);
        this.error = this.i18nService.translate(error.message) || error;
       });    */


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
}

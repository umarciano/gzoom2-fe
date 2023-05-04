import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { map,  switchMap } from 'rxjs/operators';

import { UserLogin } from '../user-login';
import { Message } from '../../commons/model/message';

import { I18NService } from '../../i18n/i18n.service';
import { ChangePasswordService } from './change-password.service';

import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { AuthService, UserProfile } from '../../commons/service/auth.service';
import { MessageService } from 'primeng/api';

import { ApiConfig } from '../../commons/model/api-config';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  loading = false;
  
  displayChangePassword = false;
  requirePasswordChange = false;
  
  user: UserLogin;
  formChangePassword: FormGroup;
  /** Error message from be*/
  error = '';
  /** Info message in Toast*/
  msgs: Message;
  
  constructor(private readonly changePasswordService: ChangePasswordService,
    private readonly i18nService: I18NService,
    private authService: AuthService,
    private readonly messageService: MessageService,
    private http: HttpClient,
    private apiConfig: ApiConfig,
    private fb: FormBuilder) { 
      this.formChangePassword = this.fb.group ({
        'currentPassword': new FormControl('', Validators.required),
        'newPassword': new FormControl('', Validators.required),
        'newPasswordVerify': new FormControl('', Validators.required)
      }, { validator: this.checkPasswordsVerify });
    }

    checkPasswordsVerify(group: FormGroup) {
      const pass = group.controls.newPassword.value;
      const confirmPass = group.controls.newPasswordVerify.value;

      return pass === confirmPass ? null : { notSame: true };
  }

  ngOnInit(): void {
    this.changePasswordService.popupObservable.subscribe(res => {
      this.user = res;
      this.open(res);
    });
    
  }

  open(user: UserLogin) {
    this.error = null;
    this.resetValues();
    this.displayChangePassword = true;
    this.requirePasswordChange = user.requirePasswordChange;
  }

  resetValues() {
    this.formChangePassword.reset();
    this.formChangePassword.setValue({currentPassword: '', newPassword: '', newPasswordVerify: ''});
  }

  changePassword() {
    this.loading = true;
    this.changePasswordService
    .changePassword(this.user.userLoginId, this.formChangePassword.value.currentPassword, this.formChangePassword.value.newPassword)
    .then(data => {
      this.loading = false;
      this.displayChangePassword = false;
      this.msgs = {severity:this.i18nService.translate('success'),
        summary:this.i18nService.translate('Change Password '),
        detail:this.i18nService.translate('Cambio password eseguito con successo ')};
      this.messageService.add(this.msgs);

    }).catch(err => {this.error = err; this.loading = false;});
    }
}

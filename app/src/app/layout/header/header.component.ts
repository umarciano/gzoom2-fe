import { Component, OnInit } from '@angular/core';
import { AuthService, UserProfile } from '../../commons/auth.service';
import { LockoutService } from '../../commons/lockout.service';
import { LogoutService } from '../../api/logout.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { DialogModule } from 'primeng/primeng';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user: UserProfile;
  displayChangePassword: boolean;
  form: FormGroup;

  currentPasswordVerify: String;
  newPassword: String;
  newPasswordVerify: String;

  constructor(private readonly authSrv: AuthService,
              private readonly lockoutSrv: LockoutService,
              private readonly logoutSrv: LogoutService,
              private fb: FormBuilder) {
    this.user = authSrv.userProfile();
  }

  ngOnInit() {

    this.form = this.fb.group({
      'currentPasswordVerify': new FormControl('', Validators.required),
      'newPassword': new FormControl('', Validators.required),
      'newPasswordVerify': new FormControl('', Validators.required)
    });

    this.displayChangePassword = false;
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('push-right');
  }

  logout() {
    this.logoutSrv.logout().then(() => {
      this.lockoutSrv.lockout();
    });
  }

  changePasswordDialog() {  
    this.displayChangePassword = true;
  }

  save() {
    this.displayChangePassword = false;
    
  }
}

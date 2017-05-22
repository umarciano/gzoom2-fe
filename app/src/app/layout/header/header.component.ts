import { Component } from '@angular/core';
import { AuthService, UserProfile } from '../../commons/auth.service';
import { LockoutService } from '../../commons/lockout.service';
import { LogoutService } from '../../api/logout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user: UserProfile;

  constructor(private readonly authSrv: AuthService,
              private readonly lockoutSrv: LockoutService,
              private readonly logoutSrv: LogoutService) {
    this.user = authSrv.userProfile();
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
}

import { Component } from '@angular/core';
import { AuthService } from '../../commons/auth.service';
import { LockoutService } from '../../commons/lockout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user: any;

  constructor(private readonly authService: AuthService, private readonly lockout: LockoutService) {
    this.user = authService.userProfile();
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('push-right');
  }

  logout() {
    this.lockout.lockout();
  }
}

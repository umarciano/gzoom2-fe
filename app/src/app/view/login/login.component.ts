import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../commons/auth.service';
import { LoginService } from '../../api/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private loginService: LoginService) { }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // if already logged in then skip this state
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  /**
   * Attempts to log the user in.
   */
  login() {
    this.loading = true;
    this.loginService
      .login(this.model.username, this.model.password)
      .then(token => {
        this.authService.save(token, true); // TODO fix this with this.model.remember
        this.loading = false;
        this.router.navigate([this.returnUrl]);
      })
      .catch(() => {
        this.error = 'Username or password is incorrect';
        this.loading = false;
      });
  }
}

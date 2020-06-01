import { map } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../commons/auth.service';
import { ApiConfig } from '../../api/api-config';
import { Node } from '../../view/node/node';

const LOGIN_ENDPOINT = 'login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';
  returnUrl: string;
  private readonly loginUrl: string;

  node: Node;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient, private apiConfig: ApiConfig) { 
      this.loginUrl = `${apiConfig.rootPath}/${LOGIN_ENDPOINT}`;
    }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    const qru = this.route.snapshot.queryParams['returnUrl'];
    this.returnUrl = qru && qru !== 'login' && qru !== '/login' ? qru : '/';

    this.route.data.pipe(
      map((data: { node: Node }) => data.node),
    ).subscribe((data) => {
      this.node = data;
    });
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
    
    const body = JSON.stringify({ username: this.model.username, password: this.model.password });
   
    this.http
      .post(this.loginUrl, body, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      }).subscribe(
        (data: any) => {
            let token = data.token;
            this.authService.save(token, true); // TODO fix this with this.model.remember
            this.loading = false;
            this.router.navigate([this.returnUrl]);
        },
        err => {
          console.log(err)
          this.authService.lockout(); // sanity check
          this.error = 'Username or password is incorrect';
          this.loading = false;
        }, // error
        () => console.log('login Complete') // complete
    );
    
  }
}

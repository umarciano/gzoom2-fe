import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../commons/service/auth.service';
import { ApiConfig } from '../../commons/model/api-config';

/**
 * Componente che gestisce il callback SSO.
 * Supporta due flussi:
 *  1. OFBiz externalLoginKey  → POST /api/sso-login?externalLoginKey=xxx
 *  2. UNIGATE OTT token       → POST /api/ott-login  { token: "xxx" }
 */
@Component({
  selector: 'app-sso-callback',
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h2>Autenticazione SSO in corso...</h2>
      <p *ngIf="error" style="color: red;">{{ error }}</p>
      <p *ngIf="loading">Attendere prego...</p>
    </div>
  `
})
export class SsoCallbackComponent implements OnInit {
  loading = true;
  error = '';
  private readonly ssoLoginUrl: string;
  private readonly ottLoginUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private apiConfig: ApiConfig
  ) {
    // NOTA: In sviluppo, Spring Boot gira su porta 8081, Angular su 4200
    // quindi dobbiamo usare l'URL assoluto invece del path relativo
    const isDevMode = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isDevMode) {
      this.ssoLoginUrl = 'http://localhost:8081/rest/api/sso-login';
      this.ottLoginUrl = 'http://localhost:8081/rest/api/ott-login';
    } else {
      this.ssoLoginUrl = `${apiConfig.rootPath}/api/sso-login`;
      this.ottLoginUrl = `${apiConfig.rootPath}/api/ott-login`;
    }

    console.log('SSO Callback - ssoLoginUrl:', this.ssoLoginUrl);
    console.log('SSO Callback - ottLoginUrl:', this.ottLoginUrl);
  }

  ngOnInit() {
    console.log('=== SSO Callback Component - START ===');

    const externalLoginKey = this.route.snapshot.queryParams['externalLoginKey'];
    const ottToken = this.route.snapshot.queryParams['token'];

    console.log('SSO Callback - externalLoginKey from URL: ' + externalLoginKey);
    console.log('SSO Callback - ottToken from URL: ' + (ottToken ? ottToken.substring(0, 8) + '...' : 'null'));

    if (ottToken) {
      this.handleOttLogin(ottToken);
    } else if (externalLoginKey) {
      // Flusso OFBiz esistente — invariato
      console.log('SSO Callback - Calling Spring Boot (sso-login): ' + this.ssoLoginUrl);

      const params = new HttpParams().set('externalLoginKey', externalLoginKey);

      this.http
        .post(this.ssoLoginUrl, null, {
          params: params,
          headers: new HttpHeaders().set('Content-Type', 'application/json')
        })
        .subscribe(
          (data: any) => {
            console.log('SSO Callback - Response from Spring Boot:', data);

            if (data && data.token) {
              console.log('SSO Callback - JWT received, saving to storage');
              this.authService.save(data.token, true);
              this.loading = false;

              console.log('SSO Callback - Redirecting to dashboard');
              this.router.navigate(['/c/dashboard']);
            } else {
              this.error = 'Invalid response from server';
              this.loading = false;
              console.error('SSO Callback - No token in response');
            }
          },
          err => {
            console.error('SSO Callback - Error:', err);
            this.error = 'SSO authentication failed: ' + (err.message || 'Unknown error');
            this.loading = false;
          }
        );
    } else {
      this.error = 'Parametri di autenticazione mancanti';
      this.loading = false;
      console.error('SSO Callback - No externalLoginKey or OTT token found in URL');
    }
  }

  private handleOttLogin(token: string) {
    console.log('SSO Callback - OTT flow - Calling: ' + this.ottLoginUrl);

    this.http
      .post(this.ottLoginUrl, { token }, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      })
      .subscribe(
        (data: any) => {
          console.log('SSO Callback - OTT Response from Spring Boot:', data);

          if (data && data.token) {
            console.log('SSO Callback - OTT JWT received, saving to storage');
            this.authService.save(data.token, true);
            this.loading = false;

            console.log('SSO Callback - OTT Redirecting to dashboard');
            this.router.navigate(['/c/dashboard']);
          } else {
            this.error = 'Invalid response from server';
            this.loading = false;
            console.error('SSO Callback - OTT No token in response');
          }
        },
        err => {
          console.error('SSO Callback - OTT Error:', err);
          this.error = 'Autenticazione OTT fallita: ' + (err.message || 'Errore sconosciuto');
          this.loading = false;
        }
      );
  }
}

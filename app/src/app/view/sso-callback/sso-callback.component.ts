import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../commons/service/auth.service';
import { ApiConfig } from '../../commons/model/api-config';

/**
 * Componente che gestisce il callback SSO da OFBiz.
 * Riceve l'externalLoginKey come query parameter, chiama Spring Boot per ottenere il JWT,
 * salva il JWT e reindirizza alla dashboard.
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
    } else {
      this.ssoLoginUrl = `${apiConfig.rootPath}/api/sso-login`;
    }
    
    console.log('SSO Callback - ssoLoginUrl:', this.ssoLoginUrl);
  }

  ngOnInit() {
    console.log('=== SSO Callback Component - START ===');
    
    // Leggi l'externalLoginKey dai query parameters
    const externalLoginKey = this.route.snapshot.queryParams['externalLoginKey'];
    
    console.log('SSO Callback - externalLoginKey from URL: ' + externalLoginKey);
    
    if (!externalLoginKey) {
      this.error = 'External login key missing';
      this.loading = false;
      console.error('SSO Callback - No externalLoginKey found in URL');
      return;
    }

    // Chiama Spring Boot per scambiare externalLoginKey con JWT
    console.log('SSO Callback - Calling Spring Boot: ' + this.ssoLoginUrl);
    
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
            
            // Redirect alla dashboard
            console.log('SSO Callback - Redirecting to dashboard');
            this.router.navigate(['/']);
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
  }
}

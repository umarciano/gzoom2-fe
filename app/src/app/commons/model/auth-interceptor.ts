import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service
    const token = this.authService.token();
    
    // Only add Authorization header if token exists
    if (token && token !== 'null' && token !== 'undefined') {
      const authHeader = 'Bearer ' + token;
      // Clone the request to add the new header
      const authReq = req.clone({
        headers: req.headers.set('Authorization', authHeader)
      });
      return next.handle(authReq);
    }
    
    // If no token, pass the original request
    return next.handle(req);
  }
}


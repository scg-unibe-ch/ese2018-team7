import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

/**
 * API interceptor to redirect all requests to our backend server
 */
@Injectable()
export class APIInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiReq = req.clone({ url: `http://` + window.location.hostname + `:3000${req.url}` });
    return next.handle(apiReq);
  }

}

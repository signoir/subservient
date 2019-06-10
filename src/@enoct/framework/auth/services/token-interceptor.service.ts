/*
 * jwt.interceptor.ts
 * Created by @anonymoussc on 03/01/2019 3:05 AM.
 */

/*
 * Copyright(c) 2019. All rights reserved.
 * Last modified 3/8/19 3:22 AM
 */

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler,): Observable<HttpEvent<any>> {
    // add authorization header with token if available
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // noinspection SpellCheckingInspection
    if (currentUser && currentUser.token) {
      // tslint:disable-next-line
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
    }

    return next.handle(request);
  }
}

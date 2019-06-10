/*
 * Copyright(c) 2019. All rights reserved.
 * Last modified 3/4/19 10:56 AM
 */

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { flow, get } from 'lodash/fp';
import { Observable } from 'rxjs';
import { AuthLoader } from '~/@enoct/framework/auth';

const getHeaders = (request: HttpRequest<any>) => (token: string) =>
  token
    ? request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : request;

@Injectable()
export class MockJwtInterceptor implements HttpInterceptor {
  constructor(private readonly loader: AuthLoader) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const intercepted = flow(
      (cur: string) => this.loader.storage.getItem(cur),
      cur => JSON.parse(cur),
      get('token'),
      getHeaders(request)
    )(this.loader.storageKey);

    return next.handle(intercepted);
  }
}

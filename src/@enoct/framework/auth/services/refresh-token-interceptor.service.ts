/*
 * token-interceptor.service.ts
 * Created by @anonymoussc on 03/07/2019 1:32 AM.
 */

/*
 * Copyright(c) 2019. All rights reserved.
 * Last modified 3/8/19 4:31 PM
 */

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';

import { AuthService } from "./auth.service";

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  // noinspection TsLint
  // tslint:disable-next-line
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError(error => {
          // We don't want to refresh token for some requests like login or refresh token itself
          // So we verify url and we throw an error if it's the case
          if (request.url.includes("refresh") || request.url.includes("login")) {
            // We do another check to see if refresh token failed
            // In this case we want to logout user and to redirect it to login page

            if (request.url.includes("refresh")) {
              this.authService.invalidate();
            }

            // return Observable.throw(error);
            return throwError(error);
          }

          // If error status is different than 401 we want to skip refresh token
          // So we check that and throw the error if it's the case
          if (error.status !== 401) {
            // return Observable.throw(error);
            return throwError(error);
          }

          if (this.refreshTokenInProgress) {
            // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
            // – which means the new token is ready and we can retry the request again
            return this.refreshTokenSubject
              .pipe(
                filter(result => result !== null),
                take(1),
                switchMap(() => next.handle(this.addAuthenticationToken(request)))
              )
          } else {
            this.refreshTokenInProgress = true;

            // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
            // noinspection TsLint
            // tslint:disable-next-line
            this.refreshTokenSubject.next(null);

            // Call authService.refreshAccessToken(this is an Observable that will be returned)
            return this.authService
              .silentRefresh()
              .pipe(
                switchMap((resToken: { access_token: string }) => {
                  this.authService.loadUser(resToken.access_token)
                    .pipe(
                      map((resUser: { username: string }) => {
                        if (resToken && resToken.access_token) {
                          this.authService.storedUserData(resUser.username, resToken.access_token);
                        }
                      })
                    ).subscribe();

                  // When the call to refreshToken completes we reset the refreshTokenInProgress to false
                  // for the next time the token needs to be refreshed
                  this.refreshTokenInProgress = false;
                  this.refreshTokenSubject.next(resToken.access_token);

                  return next.handle(this.addAuthenticationToken(request));
                }),
                catchError((err: any) => {
                  this.refreshTokenInProgress = false;

                  this.authService.invalidate();

                  return throwError(err);
                })
              )
          }
        })
      ) as any
  }

  addAuthenticationToken(request: HttpRequest<any>): any {
    // Get access token from Local Storage
    const accessToken = this.authService.token;

    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!accessToken) {
      return request;
    }

    // We clone the request, because the original request is immutable
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.token}`
      }
    });
  }
}

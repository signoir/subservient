/*
 * Copyright(c) 2019. All rights reserved.
 * Last modified 3/8/19 4:30 PM
 */

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AuthLoader } from './../loaders';

@Injectable()
export class AuthService {

  protected _token: string;
  private _redirectUrl: string;

  constructor(
    readonly loader: AuthLoader,
    protected readonly router: Router,
    @Inject(HttpClient) protected readonly http: HttpClient
  ) {
    const stored      = this.loader.storage.getItem(this.loader.storageKey);
    const authContent = stored ? stored : '{}';
    const currentUser = JSON.parse(authContent);
    this._token       = currentUser && currentUser.token;
  }

  authenticate(username: string, password: string): Observable<boolean> {
    const params = this.getHttpParams(this.loader.backend.params);

    return this.fetchToken(username, password)
      .pipe(
        switchMap(async (resToken: { access_token: string }) => {
          this.loadUser(resToken.access_token)
            .pipe(
              map((resUser: { username: string }) => {
                const token = resToken && resToken.access_token;

                if (token) {
                  this._token = token;

                  this.storedUserData(resUser.username, token);

                  return this.router.navigateByUrl(this._redirectUrl || this.loader.defaultUrl).then(() => true);
                }
              })
            ).subscribe();

          return Promise.resolve(false);
        })
      );
  }

  async invalidate(): Promise<boolean> {
    this.logoutUser()
      .pipe(
        catchError(
          // tslint:disable-next-line
          (error: any): Observable<{}> => {
            return throwError(error);
          }
        )
      ).subscribe();

    this._token = undefined;
    this.loader.storage.removeItem(this.loader.storageKey);

    return this.router.navigate(this.loader.loginRoute);
  }

  protected getHttpParams = (query?: Array<any>): HttpParams => {
    let res = new HttpParams();

    if (query) {
      for (const item of query) {
        res = res.append(item.key, item.value);
      }
    }

    return res;
  };

  get defaultUrl(): string {
    return this.loader.defaultUrl;
  }

  get isAuthenticated(): boolean {
    return !!this.loader.storage.getItem(this.loader.storageKey);
  }

  get token(): string {
    return this._token;
  }

  get redirectUrl(): string {
    return this._redirectUrl;
  }

  set redirectUrl(value: string) {
    this._redirectUrl = value;
  }

  protected fetchToken(username: string, password: string): any {
    return this.http
      .post<any>(this.loader.backend.endpoint, {
        username: username.trim(),
        password: password.trim(),
      })
  }

  storedUserData(username: string, token: string): void {
    this.loader.storage.setItem(this.loader.storageKey, JSON.stringify(
      {username, token}
    ))
  }

  silentRefresh(): any {
    return this.http
      .post<any>('http://localhost:8000/api/login/refresh', {})
  }

  loadUser(token: string): any {
    const getHeaders: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http
      .get<any>('http://localhost:8000/api/user', {
        headers: getHeaders
      })
  }

  logoutUser(): any {
    return this.http
      .post<any>('http://localhost:8000/api/logout', {})
  }
}

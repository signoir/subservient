/*
 * authentication.service.ts
 * Created by @anonymoussc on 03/01/2019 2:45 AM.
 */

/*
 * Copyright(c) 2019. All rights reserved.
 * Last modified 3/6/19 12:11 PM
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): any {
    return this.http
      .post<any>('http://localhost:8000/api/login', {
        username: username.trim(),
        password: password.trim(),
      })
      .pipe(
        map((res: any) => {
          // login successful if there's a oauth2 access token in the response
          if (res && res.access_token) {
            // store username and access token in local storage to keep user logged in between page refreshes
            localStorage.setItem(
              'currentUser',
              JSON.stringify({username, token: res.access_token}),
            );
          }
        }),
      );
  }

  logout(): any {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}

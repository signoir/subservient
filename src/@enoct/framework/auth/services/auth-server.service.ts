/*
 * Copyright(c) 2019. All rights reserved.
 * Last modified 3/6/19 12:11 PM
 */

import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';

@Injectable()
export class AuthServerService {
  get token(): string {
    return undefined;
  }

  get redirectUrl(): string {
    return undefined;
  }

  set redirectUrl(value: string) {
    return;
  }

  get defaultUrl(): string {
    return undefined;
  }

  get isAuthenticated(): boolean {
    return false;
  }

  authenticate(username: string, password: string): Observable<boolean> {
    return observableOf(false);
  }

  invalidate(): void {
    return;
  }
}

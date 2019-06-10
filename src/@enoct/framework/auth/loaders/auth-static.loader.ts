/*
 * Copyright(c) 2019. All rights reserved.
 * Last modified 3/6/19 12:11 PM
 */
import { AuthSettings, Backend } from './../entities';
import { AuthLoader } from "./auth.loader";

export class AuthStaticLoader implements AuthLoader {
  constructor(
    private readonly providedSettings: AuthSettings = {
      backend   : {
        endpoint: '/api/authenticate',
        params  : []
      },
      storage   : localStorage,
      storageKey: 'currentUser',
      loginRoute: ['login'],
      defaultUrl: ''
    }
  ) {}

  get backend(): Backend {
    return this.providedSettings.backend;
  }

  get storage(): any {
    return this.providedSettings.storage;
  }

  get storageKey(): string {
    return this.providedSettings.storageKey;
  }

  get loginRoute(): Array<any> {
    return this.providedSettings.loginRoute;
  }

  get defaultUrl(): string {
    return this.providedSettings.defaultUrl;
  }
}
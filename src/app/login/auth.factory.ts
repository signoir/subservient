/*
 * Copyright(c) 2019. All rights reserved.
 * Last modified 3/6/19 9:39 AM
 */

import { AuthLoader, AuthStaticLoader } from '~/@enoct/framework/auth';

// for AoT compilation
// tslint:disable-next-line
export function authFactory(): AuthLoader {

  return new AuthStaticLoader({
    backend   : {
      endpoint: 'http://localhost:8000/api/login',
      params  : []
    },
    storage   : localStorage,
    storageKey: 'currentUser',
    loginRoute: ['login'],
    defaultUrl: ''
  });
}
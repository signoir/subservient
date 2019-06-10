/*
 * Copyright(c) 2019. All rights reserved.
 * Last modified 3/6/19 12:11 PM
 */

import { AuthLoader, AuthStaticLoader } from './loaders';

// tslint:disable-next-line
export function authFactory(): AuthLoader {

  return new AuthStaticLoader({
    backend   : {
      endpoint: 'http://localhost:8000/api/login/failed/',
      params  : []
    },
    storage   : localStorage,
    storageKey: 'currentUser',
    loginRoute: ['login'],
    defaultUrl: ''
  });
}
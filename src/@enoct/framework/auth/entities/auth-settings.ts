/*
 * Copyright(c) 2019. All rights reserved.
 * Last modified 3/6/19 12:11 PM
 */

import { Backend } from './backend';

export interface AuthSettings {
  backend: Backend;
  storage: any;
  storageKey: string;
  loginRoute: Array<any>;
  defaultUrl: string;
}

/*
 * Copyright(c) 2019. All rights reserved.
 * Last modified 3/6/19 12:11 PM
 */

export abstract class AuthLoader {
  abstract get backend(): any;

  abstract get storage(): any;

  abstract get storageKey(): string;

  abstract get loginRoute(): Array<any>;

  abstract get defaultUrl(): string;
}
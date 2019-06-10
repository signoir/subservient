/*
 * Copyright(c) 2019. All rights reserved.
 * Last modified 3/6/19 12:11 PM
 */

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  RouterStateSnapshot
} from '@angular/router';

@Injectable()
export class AuthServerGuard implements CanActivate, CanActivateChild, CanLoad {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return false;
  }

  canLoad(route: Route): boolean {
    return false;
  }
}

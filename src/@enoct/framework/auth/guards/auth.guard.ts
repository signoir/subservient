/*
 * auth.guard.ts
 * Created by @anonymoussc on 03/01/2019 2:51 AM.
 */

// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
//
// @Injectable({providedIn: 'root'})
// export class AuthGuard implements CanActivate {
//
//   constructor(private router: Router) { }
//
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
//     if (localStorage.getItem('currentUser')) {
//       // logged in so return true
//       return true;
//     }
//
//     // not logged in so redirect to login page with the return url
//     this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
//
//     return false;
//   }
// }

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
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { AuthLoader } from './../loaders';
import { AuthService } from './../services';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private readonly loader: AuthLoader,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const url = state.url;

    return this.handleAuth(url);
  }

  async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }

  async canLoad(route: Route): Promise<boolean> {
    const url = `/${route.path}`;

    return this.handleAuth(url);
  }

  private async handleAuth(url: string): Promise<boolean> {
    if (this.auth.isAuthenticated) {
      return Promise.resolve(true);
    }

    this.auth.redirectUrl = url;

    return this.router.navigate(this.loader.loginRoute).then(() => false);
  }
}
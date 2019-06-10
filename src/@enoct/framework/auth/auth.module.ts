/*
 * Copyright(c) 2019. All rights reserved.
 * Last modified 3/6/19 12:11 PM
 */
import { Inject, InjectionToken, ModuleWithProviders, NgModule, Optional } from '@angular/core';

import { AuthSettings } from './entities';
import { AuthGuard, AuthServerGuard } from './guards';
import { AuthLoader } from './loaders';
import { AuthServerService, AuthService } from './services';

export const AUTH_FORROOT_GUARD = new InjectionToken<AuthLoader>('AUTH_FORROOT_GUARD');

@NgModule({
  providers: [
    AuthGuard,
    AuthService,
    // {
    //   provide   : AuthLoader,
    //   useFactory: authFactory
    // }
  ]
})
export class AuthModule {

  static forRoot(
    configuredProvider: any
  ): ModuleWithProviders {
    return {
      ngModule : AuthModule,
      providers: [configuredProvider]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: AuthModule
    };
  }

  static forServer(): ModuleWithProviders {
    return {
      ngModule : AuthModule,
      providers: [
        {
          provide : AuthService,
          useClass: AuthServerService
        },
        {
          provide : AuthGuard,
          useClass: AuthServerGuard
        }
      ]
    };
  }

  // tslint:disable-next-line
  constructor(@Optional() @Inject(AUTH_FORROOT_GUARD) guard: any) {
    // NOTE: inject token
  }
}

// tslint:disable-next-line
export function provideForRootGuard(settings?: AuthSettings): any {
  if (settings) {
    throw new Error('AuthModule.forRoot() already called. Child modules should use AuthModule.forChild() instead.');
  }

  return 'guarded';
}
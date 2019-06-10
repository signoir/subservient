/*
 * Copyright(c) 2019. All rights reserved.
 * Last modified 3/6/19 11:28 AM
 */

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthLoader } from '~/@enoct/framework/auth';
import { authFactory } from '~/@enoct/framework/auth/auth.factory';
import { AuthModule } from '~/@enoct/framework/auth/auth.module';

import { MockBackendInterceptor } from './mocks/backend-interceptor.mock';
import { MockJwtInterceptor } from './mocks/jwt-interceptor.mock';
import { MOCK_AUTH_PATH } from './tokens';

@NgModule({
  imports  : [HttpClientModule],
  exports  : [AuthModule],
  providers: [
    {
      provide : MOCK_AUTH_PATH,
      useValue: '/api/authenticate'
    },
    {
      provide   : AuthLoader,
      useFactory: authFactory
    },
    {
      provide : HTTP_INTERCEPTORS,
      useClass: MockBackendInterceptor,
      deps    : [MOCK_AUTH_PATH],
      multi   : true
    },
    {
      provide : HTTP_INTERCEPTORS,
      useClass: MockJwtInterceptor,
      deps    : [AuthLoader],
      multi   : true
    }
  ]
})
export class AuthTestingModule {
  static withParams(
    configuredProvider = {
      provide   : AuthLoader,
      useFactory: authFactory
    },
    path: string
  ): ModuleWithProviders {
    return {
      ngModule : AuthTestingModule,
      providers: [
        configuredProvider,
        {
          provide : MOCK_AUTH_PATH,
          useValue: path
        }
      ]
    };
  }
}

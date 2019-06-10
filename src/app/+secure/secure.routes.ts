import { AuthGuard } from '~/@enoct/framework/auth';

import { SecureComponent } from './secure.component';

export const routes = [
  {
    path: '',
    component: SecureComponent,
    canActivate: [AuthGuard],
    data: {
      meta: {
        title: 'PUBLIC.SECURE.PAGE_TITLE',
        description: 'PUBLIC.SECURE.META_DESCRIPTION'
      }
    }
  }
];

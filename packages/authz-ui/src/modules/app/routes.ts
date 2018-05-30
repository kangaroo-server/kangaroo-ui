/*
 * Copyright (c) 2018 Michael Krotscheck
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { Routes } from '@angular/router';
import { RequireLoggedInGuard } from '@kangaroo/angular-authn';
import { NoopComponent } from '@kangaroo/angular-platform';
import { ApplicationCreateComponent } from './application/application-create.component';
import { CannotConfigureComponent } from './configuration-failed/cannot-configure.component';
import { ConfigurationFailedGuard } from './configuration-failed/configuration-failed.guard';
import { ConfigurationSucceededGuard } from './configuration-failed/configuration-succeeded.guard';
import { RouterOutletComponent } from './router-outlet.component';

/**
 * Root application routes. Actual functional routes are provided by different modules.
 *
 * @author Michael Krotscheck
 */
export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: NoopComponent,
    canActivate: [
      RequireLoggedInGuard,
      ConfigurationSucceededGuard,
    ],
  },
  {
    path: 'application',
    component: RouterOutletComponent,
    canActivate: [
      RequireLoggedInGuard,
      ConfigurationSucceededGuard,
    ],
    children: [ {
      path: 'create',
      component: ApplicationCreateComponent,
    } ],
  },
  {
    path: 'configuration-failed',
    component: CannotConfigureComponent,
    canActivate: [ ConfigurationFailedGuard ],
  },
  {
    path: '**',
    redirectTo: '404',
    canActivate: [ ConfigurationSucceededGuard ],
  },
];

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
 */

import { RequireLoggedOutGuard } from '@kangaroo/angular-authn';
import { LoginComponent } from './login.component';
import { ConfigurationSucceededGuard } from '../app/configuration-failed/configuration-succeeded.guard';
import { Routes } from '@angular/router';


/**
 * All routes used by the login module.
 *
 * @author Michael Krotscheck
 */
export const ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [
      RequireLoggedOutGuard,
      ConfigurationSucceededGuard
    ]
  }
];

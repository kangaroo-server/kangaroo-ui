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

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ApplicationService } from './application.service';
import { AuthenticatorService } from './authenticator.service';
import { ClientReferrerService } from './client-referrer.service';
import { ClientRedirectService } from './client-redirect.service';
import { ClientService } from './client.service';
import { RoleService } from './role.service';
import { ScopeService } from './scope.service';
import { TokenService } from './token.service';
import { UserService } from './user.service';
import { UserIdentityService } from './user-identity.service';

export { ApplicationService } from './application.service';
export { AuthenticatorService } from './authenticator.service';
export { ClientReferrerService } from './client-referrer.service';
export { ClientRedirectService } from './client-redirect.service';
export { ClientService } from './client.service';
export { RoleService } from './role.service';
export { ScopeService } from './scope.service';
export { TokenService } from './token.service';
export { UserService } from './user.service';
export { UserIdentityService } from './user-identity.service';
export * from './model';

export * from './admin-api-root';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    ApplicationService,
    AuthenticatorService,
    ClientService,
    ClientRedirectService,
    ClientReferrerService,
    RoleService,
    ScopeService,
    TokenService,
    UserService,
    UserIdentityService
  ]
})
export class KangarooAuthorizationAdminModule {
}

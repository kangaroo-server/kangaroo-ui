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

/**
 * Barrel rollup.
 */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { OAUTH2_API_ROOT, OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SCOPES } from './contracts';
import { LoggedInSubject } from './logged-in.subject';
import { OAuth2HttpInterceptor } from './o-auth2-http-interceptor';
import { OAuth2TokenDetailsSubject } from './o-auth2-token-details.subject';
import { OAuth2TokenSubject } from './o-auth2-token.subject';
import { OAuth2Service } from './o-auth2.service';
import { RequireLoggedInGuard } from './require-logged-in.guard';
import { RequireLoggedOutGuard } from './require-logged-out.guard';

export { TokenUtil } from './util/token.util';
export { OAuth2Token } from './model/o-auth2-token';
export { OAuth2TokenDetails } from './model/o-auth2-token-details';
export { OAuth2Service } from './o-auth2.service';
export { OAuth2TokenSubject } from './o-auth2-token.subject';
export { OAuth2TokenDetailsSubject } from './o-auth2-token-details.subject';
export { RequireLoggedInGuard } from './require-logged-in.guard';
export { RequireLoggedOutGuard } from './require-logged-out.guard';
export { LoggedInSubject } from './logged-in.subject';
export * from './contracts';

/**
 * This module contains the service-based authorization contracts for an angular application built on top of
 * the Kangaroo ecosystem. To use this properly, the module needs to be provided with two external contracts: The root
 * URL for the oauth endpoint, and a boolean provider to indicate whether the token should be 'remembered' between
 * browser sessions.
 *
 * @author Michael Krotscheck
 */
@NgModule({
  providers: [
    {provide: HTTP_INTERCEPTORS, multi: true, useClass: OAuth2HttpInterceptor},
    RequireLoggedInGuard,
    RequireLoggedOutGuard,
    OAuth2TokenSubject,
    OAuth2TokenDetailsSubject,
    OAuth2Service,
    LoggedInSubject,
  ],
})
export class KangarooOAuth2Module {

  /**
   * A convenience constructor for applications that want to manage their api roots
   * via the environment parameters.
   *
   * @param baseUrl The relative-or-absolute URL that is the base from which all OAuth2 urls are built.
   * @param clientId The client ID for this application.
   * @param scopes The list of scopes which the application should ask for during the OAuth flow.
   * @returns The extended module, for import.
   */
  public static forRoot(baseUrl: string, clientId: string, scopes?: string[]): ModuleWithProviders {
    return {
      ngModule: KangarooOAuth2Module,
      providers: [
        {provide: OAUTH2_API_ROOT, useValue: [ baseUrl ]},
        {provide: OAUTH2_CLIENT_ID, useValue: [ clientId ]},
        {provide: OAUTH2_CLIENT_SCOPES, useValue: [ scopes || [] ]},
      ],
    };
  }
}

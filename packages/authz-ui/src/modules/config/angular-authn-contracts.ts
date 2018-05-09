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

import { FactoryProvider } from '@angular/core';
import { ADMIN_API_ROOT, OAUTH2_API_ROOT, OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SCOPES } from '@kangaroo/angular-authn';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { AdminApiRoot } from './admin-api-root';
import { KangarooConfigurationSubject } from './kangaroo-configuration.subject';
import { OAuthApiRoot } from './oauth-api-root';

/**
 * API Root factory.
 *
 * @param apiRoot The root provider.
 * @returns The same root provider, under a different injection token.
 */
export function oauthApiRootFactory(apiRoot): Observable<string> {
  return apiRoot;
}

/**
 * Fulfill the auth module's /oauth2 root provider contract.
 */
export const oauthApiRootProvider: FactoryProvider = {
  provide: OAUTH2_API_ROOT,
  useFactory: oauthApiRootFactory,
  deps: [ OAuthApiRoot ],
};

/**
 * Client ID provider
 *
 * @param config The configuration provider.
 * @returns A provider only for the client id.
 */
export function clientIdFactory(config: KangarooConfigurationSubject): Observable<string> {
  return config.pipe(map((conf) => conf.client));
}

/**
 * Fulfill the auth module's client id provider contract.
 */
export const clientIdProvider: FactoryProvider = {
  provide: OAUTH2_CLIENT_ID,
  useFactory: clientIdFactory,
  deps: [ KangarooConfigurationSubject ],
};

/**
 * Client Scopes provider
 *
 * @param config The configuration provider.
 * @returns A provider only for the client scopes.
 */
export function clientScopesFactory(config: KangarooConfigurationSubject): Observable<string[]> {
  return config.pipe(map((conf) => conf.scopes));
}

/**
 * Fulfill the client scopes provider contract.
 */
export const clientScopesProvider: FactoryProvider = {
  provide: OAUTH2_CLIENT_SCOPES,
  useFactory: clientScopesFactory,
  deps: [ KangarooConfigurationSubject ],
};

/**
 * Client Scopes provider
 *
 * @param apiRoot The injected admin api root.
 * @returns That same API root, under a different injection token.
 */
export function adminApiRootFactory(apiRoot): Observable<string> {
  return apiRoot;
}

/**
 * Fulfill the admin api root provider contract.
 */
export const adminApiRootProvider: FactoryProvider = {
  provide: ADMIN_API_ROOT,
  useFactory: adminApiRootFactory,
  deps: [ AdminApiRoot ],
};

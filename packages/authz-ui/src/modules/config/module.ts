/*
* Copyright (c) 2017 Michael Krotscheck
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

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AdminApiRoot } from './admin-api-root';
import {
  adminApiRootProvider,
  clientIdProvider,
  clientScopesProvider,
  oauthApiRootProvider,
} from './angular-authn-contracts';
import { KangarooConfigurationSubject } from './kangaroo-configuration.subject';
import { OAuthApiRoot } from './oauth-api-root';

/**
 * This module handles system configuration, environment detection, and all related
 * activities.
 *
 * @author Michael Krotscheck
 */
@NgModule({
  providers: [
    KangarooConfigurationSubject,
    AdminApiRoot,
    OAuthApiRoot,

    adminApiRootProvider,
    oauthApiRootProvider,
    clientIdProvider,
    clientScopesProvider,
  ],
  imports: [
    HttpClientModule,
  ],
})
export class ConfigModule {
}

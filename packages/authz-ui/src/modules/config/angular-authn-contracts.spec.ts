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

import { async, inject, TestBed } from '@angular/core/testing';
import { KangarooConfigurationSubject } from './kangaroo-configuration.subject';
import { AdminApiRoot } from './admin-api-root';
import { BrowserModule } from '@angular/platform-browser';
import { KangarooConfiguration } from './kangaroo-configuration';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { OAuthApiRoot } from './oauth-api-root';
import {
  adminApiRootProvider,
  clientIdProvider,
  clientScopesProvider,
  oauthApiRootProvider
} from './angular-authn-contracts';
import { ADMIN_API_ROOT, OAUTH2_API_ROOT, OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SCOPES } from '@kangaroo/angular-authn';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';


/**
 * Unit tests for external contracts.
 */
describe('Contracts for @kangaroo/angular-authn', () => {

  const mockConfigSubject = new ReplaySubject<KangarooConfiguration>();
  const mockConfig: KangarooConfiguration = {
    client: 'client_id',
    scopes: [ 'scope-1', 'scope-2' ]
  };

  beforeEach(() => {
    mockConfigSubject.next(mockConfig);

    TestBed.configureTestingModule({
      imports: [
        BrowserModule
      ],
      providers: [
        adminApiRootProvider,
        oauthApiRootProvider,
        clientIdProvider,
        clientScopesProvider,

        {provide: KangarooConfigurationSubject, useValue: mockConfigSubject},
        AdminApiRoot,
        OAuthApiRoot
      ]
    });
  });

  it('should provide ADMIN_API_ROOT', async(inject(
    [ ADMIN_API_ROOT, AdminApiRoot ], (contract, root) => {
      Observable
        .zip(contract, root)
        .subscribe(([ c, r ]) => expect(c).toEqual(r));
    })));

  it('should provide OAUTH2_API_ROOT', async(inject(
    [ OAUTH2_API_ROOT, OAuthApiRoot ], (contract, root) => {
      Observable
        .zip(contract, root)
        .subscribe(([ c, r ]) => expect(c).toEqual(r));
    })));

  it('should provide OAUTH2_CLIENT_ID', async(inject(
    [ OAUTH2_CLIENT_ID, KangarooConfigurationSubject ], (contract, configSubject) => {
      Observable
        .zip(contract, configSubject)
        .subscribe(([ c, config ]) => expect(c).toEqual(config.client));
    })));

  it('should provide OAUTH2_CLIENT_SCOPES', async(inject(
    [ OAUTH2_CLIENT_SCOPES, KangarooConfigurationSubject ], (contract, configSubject) => {
      Observable
        .zip(contract, configSubject)
        .subscribe(([ c, config ]) => expect(c).toEqual(config.scopes));
    })));
});

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

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { CommonModel } from '@kangaroo/ng-platform';
import { ApplicationService } from './application.service';
import { AuthenticatorService } from './authenticator.service';
import { ClientRedirectService } from './client-redirect.service';
import { ClientReferrerService } from './client-referrer.service';
import { ClientService } from './client.service';
import { RoleService } from './role.service';
import { ScopeService } from './scope.service';
import { TokenService } from './token.service';
import { UserIdentityService } from './user-identity.service';
import { UserService } from './user.service';

/**
 * Unit tests for all API resources..
 */
describe('Resource', () => {

  const parentEntity: CommonModel = {
    id: 'parent_id',
    createdDate: 10000,
    modifiedDate: 20000,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
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
        UserIdentityService,
      ],
      imports: [
        HttpClientTestingModule,
      ],
    });
  });

  it('should correctly map the application service',
    async(inject([ ApplicationService, HttpTestingController ], (service, http) => {

      service.read('test_id').subscribe();
      http.expectOne({method: 'GET', url: '/application/test_id'});

      service.browse().subscribe();
      http.expectOne((req) => req.url === '/application/' && req.method === 'GET');
    })));

  it('should correctly map the authenticator service',
    async(inject([ AuthenticatorService, HttpTestingController ], (service, http) => {

      service.read('test_id').subscribe();
      http.expectOne({method: 'GET', url: '/authenticator/test_id'});

      service.browse().subscribe();
      http.expectOne((req) => req.url === '/authenticator/' && req.method === 'GET');
    })));

  it('should correctly map the client service',
    async(inject([ ClientService, HttpTestingController ], (service, http) => {

      service.read('test_id').subscribe();
      http.expectOne({method: 'GET', url: '/client/test_id'});

      service.browse().subscribe();
      http.expectOne((req) => req.url === '/client/' && req.method === 'GET');
    })));

  it('should correctly map the client redirect service',
    async(inject([ ClientRedirectService, HttpTestingController ], (service, http) => {

      service.read(parentEntity, 'test_id').subscribe();
      http.expectOne({method: 'GET', url: '/client/parent_id/redirect/test_id'});

      service.browse(parentEntity).subscribe();
      http.expectOne((req) => req.url === '/client/parent_id/redirect/' && req.method === 'GET');
    })));

  it('should correctly map the client referrer service'
    , async(inject([ ClientReferrerService, HttpTestingController ], (service, http) => {

      service.read(parentEntity, 'test_id').subscribe();
      http.expectOne({method: 'GET', url: '/client/parent_id/referrer/test_id'});

      service.browse(parentEntity).subscribe();
      http.expectOne((req) => req.url === '/client/parent_id/referrer/' && req.method === 'GET');
    })));

  it('should correctly map the role service',
    async(inject([ RoleService, HttpTestingController ], (service, http) => {

      service.read('test_id').subscribe();
      http.expectOne({method: 'GET', url: '/role/test_id'});

      service.browse().subscribe();
      http.expectOne((req) => req.url === '/role/' && req.method === 'GET');
    })));

  it('should correctly map the scope service',
    async(inject([ ScopeService, HttpTestingController ], (service, http) => {

      service.read('test_id').subscribe();
      http.expectOne({method: 'GET', url: '/scope/test_id'});

      service.browse().subscribe();
      http.expectOne((req) => req.url === '/scope/' && req.method === 'GET');
    })));

  it('should correctly map the token service',
    async(inject([ TokenService, HttpTestingController ], (service, http) => {

      service.read('test_id').subscribe();
      http.expectOne({method: 'GET', url: '/token/test_id'});

      service.browse().subscribe();
      http.expectOne((req) => req.url === '/token/' && req.method === 'GET');
    })));

  it('should correctly map the user service',
    async(inject([ UserService, HttpTestingController ], (service, http) => {

      service.read('test_id').subscribe();
      http.expectOne({method: 'GET', url: '/user/test_id'});

      service.browse().subscribe();
      http.expectOne((req) => req.url === '/user/' && req.method === 'GET');
    })));

  it('should correctly map the user identity service',
    async(inject([ UserIdentityService, HttpTestingController ], (service, http) => {

      service.read('test_id').subscribe();
      http.expectOne({method: 'GET', url: '/identity/test_id'});

      service.browse().subscribe();
      http.expectOne((req) => req.url === '/identity/' && req.method === 'GET');
    })));
});

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

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { OAUTH2_API_ROOT, OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SCOPES } from './contracts';
import { OAuth2Token } from './model/o-auth2-token';
import { OAuth2TokenDetails } from './model/o-auth2-token-details';
import { OAuth2HttpInterceptor } from './o-auth2-http-interceptor';
import { OAuth2TokenDetailsSubject } from './o-auth2-token-details.subject';
import { OAuth2TokenSubject } from './o-auth2-token.subject';
import { OAuth2Service } from './o-auth2.service';

/**
 * Unit tests for the OAuth2 Token Details Subject.
 */
describe('OAuth2TokenDetailsSubject', () => {

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const mockToken1: OAuth2Token = {
    access_token: 'access_token_1',
    token_type: 'Bearer',
    issue_date: nowInSeconds - 1000,
    expires_in: 2000,
    refresh_token: 'refresh_token_1',
    scope: 'scope-1 scope-2',
  };
  const detailsSuccess: OAuth2TokenDetails = {
    active: true,
    scope: 'scope-1 scope-2',
    client_id: 'client_id',
    username: 'username',
    token_type: 'token_type',
    exp: nowInSeconds,
    iat: nowInSeconds,
    nbf: nowInSeconds,
    sub: 'subject',
    aud: 'audience',
    iss: 'issuer',
    jti: 'token_id',
  };
  const detailsFailed: OAuth2TokenDetails = {
    active: false,
  };
  let tokenSubject: BehaviorSubject<OAuth2Token>;

  beforeEach(() => {
    tokenSubject = new BehaviorSubject<OAuth2Token>(mockToken1);
    TestBed.configureTestingModule({
      providers: [
        {provide: OAUTH2_API_ROOT, useValue: [ '' ]},
        {provide: OAUTH2_CLIENT_ID, useValue: [ 'client_id' ]},
        {provide: OAUTH2_CLIENT_SCOPES, useValue: [ [] ]},
        {provide: OAuth2TokenSubject, useValue: tokenSubject},
        OAuth2TokenDetailsSubject,
        OAuth2Service,
      ],
      imports: [
        HttpClientTestingModule,
      ],
    });
  });

  it('should construct', inject([ OAuth2TokenDetailsSubject ], (subject) => {
    expect(subject).toBeDefined();
  }));

  it('should trigger http requests to the introspection endpoint if the token is valid', async(inject(
    [ HttpTestingController, OAuth2TokenSubject, OAuth2TokenDetailsSubject ], (http, token, details) => {
      details.subscribe((detail) => expect(detail).toEqual(detailsSuccess));
      http.expectOne('/introspect')
        .flush(detailsSuccess);
    })));

  it('should not trigger introspection requests if the original token isn\'t valid', async(inject(
    [ HttpTestingController, OAuth2TokenSubject, OAuth2TokenDetailsSubject ], (http, token, details) => {
      http.expectOne('/introspect').flush(detailsSuccess);
      token.next(null);
      details.subscribe((detail) => expect(detail).toEqual(detailsFailed));
      http.verify();
    })));

  it('should show an inactive introspection body if introspection errors', async(inject(
    [ HttpTestingController, OAuth2TokenSubject, OAuth2TokenDetailsSubject ], (http, token, details) => {
      http.expectOne('/introspect').error(null, {status: 400, statusText: 'Bad Request'});
      details.subscribe((detail) => expect(detail).toEqual(detailsFailed));
      http.verify();
    })));
});

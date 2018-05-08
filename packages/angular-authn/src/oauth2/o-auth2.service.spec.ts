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

import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { OAUTH2_API_ROOT, OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SCOPES } from './contracts';
import { OAuth2Token } from './model/o-auth2-token';
import { OAuth2TokenDetails } from './model/o-auth2-token-details';
import { OAuth2TokenSubject } from './o-auth2-token.subject';
import { OAuth2Service } from './o-auth2.service';

/**
 * Unit tests for the OAuth2 Service.
 */
describe('OAuth2Service', () => {

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const mockToken1: OAuth2Token = {
    access_token: 'access_token_1',
    token_type: 'Bearer',
    issue_date: null,
    expires_in: 2000,
    refresh_token: 'refresh_token_1',
    scope: 'scope-1 scope-2',
  };
  const mockToken2: OAuth2Token = {
    access_token: 'access_token_2',
    token_type: 'Bearer',
    issue_date: null,
    expires_in: 2000,
    refresh_token: 'refresh_token_2',
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
  let scopeSubject: BehaviorSubject<string[]>;
  let mockApiRoot: BehaviorSubject<string>;

  /**
   * Convenience helper for failure cases.
   */
  function pass() {
    // do nothing.
  }

  /**
   * Test two tokens, omitting the issue date.
   */
  function tokenEquals(token1: OAuth2Token, token2: OAuth2Token) {
    expect(token1.refresh_token).toEqual(token2.refresh_token);
    expect(token1.access_token).toEqual(token2.access_token);
    expect(token1.token_type).toEqual(token2.token_type);
    expect(token1.expires_in).toEqual(token2.expires_in);
    expect(token1.scope).toEqual(token2.scope);
  }

  beforeEach(() => {
    tokenSubject = new BehaviorSubject<OAuth2Token>(undefined);
    scopeSubject = new BehaviorSubject<string[]>([ 'scope-1', 'scope-2' ]);
    mockApiRoot = new BehaviorSubject<string>('');

    TestBed.configureTestingModule({
      providers: [
        OAuth2Service,
        {provide: OAUTH2_API_ROOT, useValue: mockApiRoot},
        {provide: OAUTH2_CLIENT_ID, useValue: [ 'client_id' ]},
        {provide: OAUTH2_CLIENT_SCOPES, useValue: scopeSubject},
        {provide: OAuth2TokenSubject, useValue: tokenSubject},
      ],
      imports: [
        HttpClientTestingModule,
      ],
    });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('should construct',
    async(inject([ OAuth2Service ], (service) => {
      expect(service).toBeDefined();
    })));

  describe('login', () => {
    it('should respect the value of the root API',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.login('user', 'password').subscribe((value) => tokenEquals(value, mockToken1));
        http.expectOne({url: '/token', method: 'POST'}).flush(mockToken1);

        mockApiRoot.next('/oauth2');
        service.login('user', 'password').subscribe((value) => tokenEquals(value, mockToken1));
        http.expectOne({url: '/oauth2/token', method: 'POST'}).flush(mockToken1);
      })));

    it('should permit null scopes',
      async(inject([ HttpTestingController, OAuth2Service, OAUTH2_CLIENT_SCOPES ], (http, service, scopes) => {
        scopes.next(null);
        service.login('user', 'password')
          .subscribe((value) => tokenEquals(value, mockToken1));
        const testRequest: TestRequest = http.expectOne({url: '/token', method: 'POST'});
        expect(testRequest.request.detectContentTypeHeader()).toContain('application/x-www-form-urlencoded');

        const body: HttpParams = testRequest.request.body;
        expect(body.get('username')).toEqual('user');
        expect(body.get('password')).toEqual('password');
        expect(body.get('client_id')).toEqual('client_id');
        expect(body.get('scope')).toBeNull();
        expect(body.get('grant_type')).toEqual('password');
      })));

    it('should issue a valid owner credentials request',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.login('user', 'password').subscribe();
        const testRequest: TestRequest = http.expectOne({url: '/token', method: 'POST'});

        expect(testRequest.request.detectContentTypeHeader()).toContain('application/x-www-form-urlencoded');

        const body: HttpParams = testRequest.request.body;
        expect(body.get('username')).toEqual('user');
        expect(body.get('password')).toEqual('password');
        expect(body.get('client_id')).toEqual('client_id');
        expect(body.get('scope')).toEqual('scope-1 scope-2');
        expect(body.get('grant_type')).toEqual('password');
      })));

    it('should not issue a owner credentials request if the credentials are not passed',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.login(null, 'password').subscribe(fail, pass);
        service.login('user', null).subscribe(fail, pass);
        http.verify();
      })));

    it('should update the subject on success',
      async(inject([ HttpTestingController, OAuth2Service, OAuth2TokenSubject ], (http, service, subject) => {
        service.login('user', 'password').subscribe((value) => tokenEquals(value, mockToken1));
        http.expectOne({url: '/token', method: 'POST'}).flush(mockToken1);

        tokenEquals(subject.value, mockToken1);
      })));

    it('should decorate the returned token with a date.',
      async(inject([ HttpTestingController, OAuth2Service, OAuth2TokenSubject ], (http, service, subject) => {
        service.login('user', 'password')
          .subscribe((value) => expect(value.issue_date).toBeTruthy());
        http.expectOne({url: '/token', method: 'POST'})
          .flush(mockToken1, {headers: {Date: new Date().toUTCString()}});
      })));

    it('should throw an error on failure',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.login('user', 'password')
          .subscribe(fail, pass);
        http.expectOne({url: '/token', method: 'POST'})
          .error({}, {status: 401, statusText: 'Unauthorized'});
      })));
  });

  describe('refresh', () => {
    it('should respect the value of the root API',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.refresh(mockToken1).subscribe((value) => tokenEquals(value, mockToken2));
        http.expectOne({url: '/token', method: 'POST'}).flush(mockToken2);

        mockApiRoot.next('/oauth2');
        service.refresh(mockToken2).subscribe((value) => tokenEquals(value, mockToken1));
        http.expectOne({url: '/oauth2/token', method: 'POST'}).flush(mockToken1);
      })));

    it('should issue a valid refresh request',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.refresh(mockToken1).subscribe();
        const testRequest: TestRequest = http.expectOne({url: '/token', method: 'POST'});

        expect(testRequest.request.detectContentTypeHeader()).toContain('application/x-www-form-urlencoded');

        const body: HttpParams = testRequest.request.body;
        expect(body.get('refresh_token')).toEqual('refresh_token_1');
        expect(body.get('client_id')).toEqual('client_id');
        expect(body.get('scope')).toEqual('scope-1 scope-2');
        expect(body.get('grant_type')).toEqual('refresh_token');
      })));

    it('should not issue a refresh request if the token is empty',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.refresh(null).subscribe(fail, pass);
        service.refresh({}).subscribe(fail, pass);
        http.verify();
      })));

    it('should return an error if the request errors',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.refresh(mockToken1).subscribe(fail, pass);
        http.expectOne({url: '/token', method: 'POST'})
          .error(null, {status: 500, statusText: 'Internal Server Error'});
      })));

    it('should update the subject on success',
      async(inject([ HttpTestingController, OAuth2Service, OAuth2TokenSubject ], (http, service, subject) => {
        subject.next(mockToken1);
        service.refresh(mockToken1).subscribe((value) => tokenEquals(value, mockToken2));
        http.expectOne({url: '/token', method: 'POST'}).flush(mockToken2);
        tokenEquals(subject.value, mockToken2);
      })));

    it('should block when multiple refresh requests fire at the same time',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.refresh(mockToken1)
          .subscribe((value) => tokenEquals(value, mockToken2));
        service.refresh(mockToken1)
          .subscribe((value) => tokenEquals(value, mockToken2));
        http.expectOne({url: '/token', method: 'POST'}).flush(mockToken2);
        http.verify();
      })));

    it('should throw an error on failure',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.refresh(mockToken1)
          .subscribe(fail, pass);
        http.expectOne({url: '/token', method: 'POST'})
          .error({}, {status: 401, statusText: 'Unauthorized'});
        http.verify();
      })));

    it('should decorate the returned token with a date.',
      async(inject([ HttpTestingController, OAuth2Service, OAuth2TokenSubject ], (http, service, subject) => {
        service.refresh(mockToken1)
          .subscribe((value) => expect(value.issue_date).toBeTruthy());
        http.expectOne({url: '/token', method: 'POST'})
          .flush(mockToken1, {headers: {Date: new Date().toUTCString()}});
      })));
  });

  describe('introspect', () => {
    it('should respect the value of the root API',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.introspect(mockToken1).subscribe((value) => expect(value).toEqual(detailsSuccess));
        http.expectOne({url: '/introspect', method: 'POST'}).flush(detailsSuccess);

        mockApiRoot.next('/oauth2');
        service.introspect(mockToken2).subscribe((value) => expect(value).toEqual(detailsFailed));
        http.expectOne({url: '/oauth2/introspect', method: 'POST'}).flush(detailsFailed);
      })));

    it('should issue a valid introspection request',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.introspect(mockToken1).subscribe();
        const testRequest: TestRequest = http.expectOne({url: '/introspect', method: 'POST'});

        expect(testRequest.request.detectContentTypeHeader()).toContain('application/x-www-form-urlencoded');

        expect(testRequest.request.headers.get('Authorization'))
          .toEqual('Bearer access_token_1');
        const body: HttpParams = testRequest.request.body;
        expect(body.get('token')).toEqual('access_token_1');
      })));

    it('should not issue a introspection request if the token is empty',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.introspect(null).subscribe(fail, pass);
        service.introspect({}).subscribe(fail, pass);
        service.introspect({token_type: 'Bearer'}).subscribe(fail, pass);
        service.introspect({access_token: 'token_without_type'}).subscribe(fail, pass);
        http.verify();
      })));

    it('should return the details on a valid token',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service
          .introspect(mockToken1)
          .subscribe((value) => expect(value).toEqual(detailsSuccess));
        http.expectOne({url: '/introspect', method: 'POST'})
          .flush(detailsSuccess);
      })));

    it('should return the details on an invalid token',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service
          .introspect(mockToken1)
          .subscribe((value) => expect(value).toEqual(detailsFailed));
        http.expectOne({url: '/introspect', method: 'POST'})
          .flush(detailsFailed);
      })));

    it('should return an error if the request errors',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.introspect(mockToken1).subscribe(fail, pass);
        http.expectOne({url: '/introspect', method: 'POST'})
          .error(null, {status: 404, statusText: 'Not Found'});
      })));
  });

  describe('revoke', () => {
    it('should respect the value of the root API',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.revoke(mockToken1).subscribe((value) => expect(value).toEqual(true));
        http
          .expectOne({url: '/revoke', method: 'POST'})
          .flush(null, {status: 205, statusText: 'Reset Content'});

        mockApiRoot.next('/oauth2');
        service.revoke(mockToken2).subscribe((value) => expect(value).toEqual(true));
        http.expectOne({url: '/oauth2/revoke', method: 'POST'})
          .flush(null, {status: 205, statusText: 'Reset Content'});
      })));

    it('should issue a valid revocation request',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.revoke(mockToken1).subscribe();
        const testRequest: TestRequest = http.expectOne({url: '/revoke', method: 'POST'});

        expect(testRequest.request.detectContentTypeHeader()).toContain('application/x-www-form-urlencoded');

        expect(testRequest.request.headers.get('Authorization'))
          .toEqual('Bearer access_token_1');
        const body: HttpParams = testRequest.request.body;
        expect(body.get('token')).toEqual('access_token_1');
      })));

    it('should not issue a revocation request if the token is empty',
      async(inject([ HttpTestingController, OAuth2Service ], (http, service) => {
        service.revoke(null).subscribe(fail, pass);
        service.revoke({}).subscribe(fail, pass);
        service.revoke({token_type: 'Bearer'}).subscribe(fail, pass);
        service.revoke({access_token: 'token_without_type'}).subscribe(fail, pass);
        http.verify();
      })));

    it('should clear the subject on success',
      async(inject([ HttpTestingController, OAuth2Service, OAuth2TokenSubject ], (http, service, subject) => {
        subject.next(mockToken1);
        service.revoke(mockToken1).subscribe((value) => expect(value).toEqual(true));
        http
          .expectOne({url: '/revoke', method: 'POST'})
          .flush(null, {status: 205, statusText: 'Reset Content'});
        expect(subject.value).toBeFalsy();
      })));

    it('should not clear the subject on failure',
      async(inject([ HttpTestingController, OAuth2Service, OAuth2TokenSubject ], (http, service, subject) => {
        subject.next(mockToken1);
        service.revoke(mockToken1).subscribe(fail, pass);
        http
          .expectOne({url: '/revoke', method: 'POST'})
          .error(null, {status: 404, statusText: 'Not Found'});
        expect(subject.value).toEqual(mockToken1);
      })));
  });
});

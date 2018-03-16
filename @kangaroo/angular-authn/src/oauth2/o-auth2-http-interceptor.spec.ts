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

import { OAuth2HttpInterceptor } from './o-auth2-http-interceptor';
import { OAuth2Token } from './model/o-auth2-token';
import { OAuth2TokenSubject } from './o-auth2-token.subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { async, inject, TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OAUTH2_API_ROOT, OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SCOPES } from './contracts';
import { OAuth2Service } from './o-auth2.service';

/**
 * Unit tests for the OAuth2 Token Subject.
 */
describe('OAuth2HttpInterceptor', () => {

  let testSubject: BehaviorSubject<OAuth2Token>;
  const testUrl = 'https://example.com'; // tslint:disable-line
  const now = new Date();
  const nowInSeconds = Math.floor(now.getTime() / 1000);

  const validToken1: OAuth2Token = {
    access_token: 'access_token_1',
    refresh_token: 'refresh_token_1',
    issue_date: nowInSeconds - 100,
    expires_in: 3600,
    token_type: 'Bearer'
  };
  const validToken2: OAuth2Token = {
    access_token: 'access_token_2',
    refresh_token: 'refresh_token_2',
    issue_date: nowInSeconds,
    expires_in: 3600,
    token_type: 'Bearer'
  };

  beforeEach(() => {
    testSubject = new BehaviorSubject<OAuth2Token>(null);
    TestBed.configureTestingModule({
      providers: [
        {provide: HTTP_INTERCEPTORS, multi: true, useClass: OAuth2HttpInterceptor},
        {provide: OAUTH2_API_ROOT, useValue: [ '' ]},
        {provide: OAUTH2_CLIENT_ID, useValue: [ 'client_id' ]},
        {provide: OAUTH2_CLIENT_SCOPES, useValue: [ [] ]},
        {provide: OAuth2TokenSubject, useValue: testSubject},
        OAuth2Service
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
  });

  it('should not provide a header if the token is null',
    async(inject([ HttpClient, HttpTestingController ], (client, http) => {
      client.get(testUrl).subscribe();

      const mockResponse = http.expectOne(testUrl);
      expect(mockResponse.request.headers.has('Authorization')).toBeFalsy();
    })));

  it('should not provide a header if the token is expired',
    async(inject([ HttpClient, HttpTestingController ], (client, http) => {
      testSubject.next({
        access_token: 'expired_token',
        issue_date: nowInSeconds - 1000,
        expires_in: 500,
        token_type: 'Bearer'
      });
      client.get(testUrl).subscribe();

      const mockResponse = http.expectOne(testUrl);
      expect(mockResponse.request.headers.has('Authorization')).toBeFalsy();
    })));

  it('should not provide a header if the token is blank',
    async(inject([ HttpClient, HttpTestingController ], (client, http) => {
      testSubject.next(<any>{});
      client.get(testUrl).subscribe();

      const mockResponse = http.expectOne(testUrl);
      expect(mockResponse.request.headers.has('Authorization')).toBeFalsy();
    })));

  it('should use the token "type value" format when creating the header',
    async(inject([ HttpClient, HttpTestingController ], (client, http) => {
      testSubject.next(validToken1);
      client.get(testUrl).subscribe();

      const mockResponse = http.expectOne(testUrl);
      expect(mockResponse.request.headers.has('Authorization')).toBeTruthy();
      expect(mockResponse.request.headers.get('Authorization'))
        .toEqual(`${validToken1.token_type} ${validToken1.access_token}`);

    })));

  it('should do nothing on a successful request',
    async(inject([ HttpClient, HttpTestingController ], (client, http) => {
      client.get(testUrl).subscribe((result) => expect(result).toBeDefined());
      http.expectOne(testUrl).flush({}, {status: 200, statusText: 'OK'});
      http.verify();
    })));

  it('should attempt to refresh a token if a 401 is detected.',
    async(inject([ HttpClient, HttpTestingController, OAuth2TokenSubject ], (client, http, subject) => {
      subject.next(validToken1);

      // Kick off the initial request.
      client.get(testUrl).subscribe((result) => expect(result).toBeDefined(), fail);
      http.expectOne(testUrl).flush({}, {status: 401, statusText: 'OK'});
      http.expectOne('/token').flush(validToken2);
      http.expectOne(testUrl).flush({}, {status: 200, statusText: 'OK'});
      http.verify();

      expect(subject.value.access_token).toEqual(validToken2.access_token);
    })));

  it('should block multiple requests during a refresh cycle',
    async(inject([ HttpClient, HttpTestingController, OAuth2TokenSubject ], (client, http, subject) => {
      subject.next(validToken1);
      client.get(testUrl).subscribe((result) => expect(result).toBeDefined(), fail);
      http.expectOne(testUrl).error(null, {status: 401, statusText: 'Unauthorized'});
      client.get(testUrl).subscribe((result) => expect(result).toBeDefined(), fail);
      http.expectOne(testUrl).error(null, {status: 401, statusText: 'Unauthorized'});
      http.expectOne('/token').flush(validToken2);
      expect(subject.value.access_token).toEqual(validToken2.access_token);

      const testRequests = http.match(testUrl);
      expect(testRequests.length).toEqual(2);

      testRequests.forEach((tr) => tr.flush({}, {status: 200, statusText: 'OK'}));
      http.verify();
    })));

  it('should do nothing if a non-401 error is detected',
    async(inject([ HttpClient, HttpTestingController, OAuth2TokenSubject ], (client, http, subject) => {
      subject.next(validToken1);
      client.get(testUrl).subscribe(fail, () => {
      });
      http.expectOne(testUrl).error(null, {status: 400, statusText: 'Bad Request'});
      http.verify();
    })));

  it('should do nothing if a 401 is detected, and there is no token',
    async(inject([ HttpClient, HttpTestingController, OAuth2TokenSubject ], (client, http) => {
      client.get(testUrl).subscribe(fail, () => {
      });
      http.expectOne(testUrl).error(null, {status: 401, statusText: 'Unauthorized'});
      http.verify();
    })));

  it('should rethrow the original error if the refresh fails.',
    async(inject([ HttpClient, HttpTestingController, OAuth2TokenSubject ], (client, http, subject) => {
      subject.next(validToken1);
      client.get(testUrl)
        .subscribe(fail, (err) => {
          expect(err.status).toEqual(401);
        });

      http.expectOne(testUrl).error({}, {status: 401, statusText: 'Unauthorized'});
      http.expectOne('/token').error({}, {status: 400, statusText: 'Bad Request'});
      expect(subject.value).toBeFalsy();
      http.verify();
    })));
});

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

/**
 * Unit tests for the OAuth2 Token Subject.
 */
describe('OAuth2HttpInterceptor', () => {

  let testSubject: BehaviorSubject<OAuth2Token>;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const validToken: OAuth2Token = {
    access_token: 'access_token',
    issue_date: nowInSeconds,
    expires_in: 3600,
    token_type: 'Bearer'
  };

  beforeEach(() => {
    testSubject = new BehaviorSubject<OAuth2Token>(null);
    TestBed.configureTestingModule({
      providers: [
        {provide: HTTP_INTERCEPTORS, multi: true, useClass: OAuth2HttpInterceptor},
        {provide: OAuth2TokenSubject, useValue: testSubject}
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
  });

  it('should not provide a header if the token is null',
    async(inject([ HttpClient, HttpTestingController ], (client, http) => {
      client.get('http://example.com').subscribe();

      const mockResponse = http.expectOne('http://example.com');
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
      client.get('http://example.com').subscribe();

      const mockResponse = http.expectOne('http://example.com');
      expect(mockResponse.request.headers.has('Authorization')).toBeFalsy();
    })));

  it('should not provide a header if the token is blank',
    async(inject([ HttpClient, HttpTestingController ], (client, http) => {
      testSubject.next(<any>{});
      client.get('http://example.com').subscribe();

      const mockResponse = http.expectOne('http://example.com');
      expect(mockResponse.request.headers.has('Authorization')).toBeFalsy();
    })));

  it('should use the token "type value" format when creating the header',
    async(inject([ HttpClient, HttpTestingController ], (client, http) => {
      testSubject.next(validToken);
      client.get('http://example.com').subscribe();

      const mockResponse = http.expectOne('http://example.com');
      expect(mockResponse.request.headers.has('Authorization')).toBeTruthy();
      expect(mockResponse.request.headers.get('Authorization'))
        .toEqual(`${validToken.token_type} ${validToken.access_token}`);

    })));
});

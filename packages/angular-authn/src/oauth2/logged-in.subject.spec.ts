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

import { OAuth2TokenSubject } from './o-auth2-token.subject';
import { async, inject, TestBed } from '@angular/core/testing';
import { OAuth2Token } from './model/o-auth2-token';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LoggedInSubject } from './logged-in.subject';

/**
 * Unit tests for the LoggedInSubject.
 */
describe('LoggedInSubject', () => {

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const validToken: OAuth2Token = {
    access_token: 'access_token_1',
    refresh_token: 'refresh_token_1',
    issue_date: nowInSeconds - 100,
    expires_in: 3600,
    token_type: 'Bearer'
  };
  const expiredToken: OAuth2Token = {
    access_token: 'access_token_2',
    refresh_token: 'refresh_token_2',
    issue_date: nowInSeconds - 100,
    expires_in: 50,
    token_type: 'Bearer'
  };
  let tokenSubject: BehaviorSubject<OAuth2Token>;

  beforeEach(() => {
    tokenSubject = new BehaviorSubject<OAuth2Token>(validToken);
    TestBed.configureTestingModule({
      providers: [
        {provide: OAuth2TokenSubject, useValue: tokenSubject},
        LoggedInSubject
      ]
    });
  });

  it('should construct', inject([ LoggedInSubject ], (subject) => {
    expect(subject).toBeDefined();
  }));

  it('should be false if the token is expired', async(inject(
    [ OAuth2TokenSubject, LoggedInSubject ], (token, loggedIn) => {
      token.next(expiredToken);
      loggedIn.subscribe((value) => expect(value).toEqual(false));
    })));

  it('should be false if the token is empty', async(inject(
    [ OAuth2TokenSubject, LoggedInSubject ], (token, loggedIn) => {
      token.next(null);
      loggedIn.subscribe((value) => expect(value).toEqual(false));
    })));

  it('should be true if the token is valid', async(inject(
    [ OAuth2TokenSubject, LoggedInSubject ], (token, loggedIn) => {
      token.next(validToken);
      loggedIn.subscribe((value) => expect(value).toEqual(true));
    })));
});

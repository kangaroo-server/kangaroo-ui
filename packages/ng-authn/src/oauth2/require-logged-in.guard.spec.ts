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

import { async, inject, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { OAuth2Token } from './model/o-auth2-token';
import { OAuth2TokenSubject } from './o-auth2-token.subject';
import { RequireLoggedInGuard } from './require-logged-in.guard';

/**
 * Unit tests for the valid login route guard.
 */
describe('RequireLoggedInGuard', () => {

  const nowInSeconds = Math.floor(Date.now() / 1000);
  let testSubject: Subject<OAuth2Token>;

  beforeEach(() => {
    testSubject = new Subject<OAuth2Token>();
    TestBed.configureTestingModule({
      providers: [
        RequireLoggedInGuard,
        {provide: OAuth2TokenSubject, useValue: testSubject},
      ],
    });
  });

  it('should construct', inject([ RequireLoggedInGuard ], (guard) => {
    expect(guard).toBeDefined();
  }));

  it('should permit access if the token is valid',
    async(inject([ RequireLoggedInGuard, OAuth2TokenSubject ], (guard, token) => {
      guard.canActivate()
        .subscribe((value) => expect(value).toBeTruthy());
      token.next({
        issue_date: nowInSeconds - 1000,
        expires_in: 2000,
      });
    })));

  it('should deny access if the token is expired',
    async(inject([ RequireLoggedInGuard, OAuth2TokenSubject ], (guard, token) => {
      guard.canActivate().subscribe((value) => expect(value).toBeFalsy());
      token.next({
        issue_date: nowInSeconds - 1000,
        expires_in: 500,
      });
    })));

  it('should deny access if the token does not exist',
    async(inject([ RequireLoggedInGuard, OAuth2TokenSubject ], (guard, token) => {
      token.next(null);
      guard.canActivate().subscribe((value) => expect(value).toBeFalsy());
    })));
});

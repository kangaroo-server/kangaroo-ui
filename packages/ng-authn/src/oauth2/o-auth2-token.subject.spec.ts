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

import { inject, TestBed } from '@angular/core/testing';
import { OAuth2Token } from './model/o-auth2-token';
import { OAuth2TokenSubject } from './o-auth2-token.subject';

/**
 * Unit tests for the OAuth2 Token Subject.
 */
describe('OAuth2TokenSubject', () => {

  const validToken: OAuth2Token = {
    access_token: 'access_token',
    issue_date: 0,
    expires_in: 3600,
    token_type: 'Bearer',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ OAuth2TokenSubject ],
    });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('should construct', inject([ OAuth2TokenSubject ], (subject) => {
    expect(subject).toBeDefined();
  }));

  it('should persist values to the local store', inject([ OAuth2TokenSubject ], (subject) => {
    subject.next(validToken);

    const value = JSON.parse(window.localStorage.getItem('_kangaroo_token'));
    expect(value).toEqual(validToken);
  }));
});

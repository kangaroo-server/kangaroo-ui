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

import { TokenUtil } from './token.util';
import { OAuth2Token } from '..';

/**
 * Unit tests for the OAuth2 Service.
 */
describe('TokenUtil', () => {

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const validToken: OAuth2Token = {
    access_token: 'access_token_1',
    token_type: 'Bearer',
    issue_date: nowInSeconds - 1000,
    expires_in: 2000,
    refresh_token: 'refresh_token_1',
    scope: 'scope-1 scope-2'
  };

  it('should return false with null', () => {
    expect(TokenUtil.isValid(null)).toBeFalsy();
    expect(TokenUtil.isExpired(null)).toBeTruthy();
  });

  it('should return false with undefined', () => {
    expect(TokenUtil.isValid(undefined)).toBeFalsy();
    expect(TokenUtil.isExpired(undefined)).toBeTruthy();
  });

  it('should return true if expired', () => {
    const expiredToken: OAuth2Token = Object.assign({}, validToken, {expires_in: 500});
    expect(TokenUtil.isValid(expiredToken)).toBeFalsy();
    expect(TokenUtil.isExpired(expiredToken)).toBeTruthy();
  });

  it('should return false if expires_in is missing', () => {
    const expiredToken: OAuth2Token = Object.assign({}, validToken, {expires_in: null});
    expect(TokenUtil.isValid(expiredToken)).toBeFalsy();
    expect(TokenUtil.isExpired(expiredToken)).toBeTruthy();
  });

  it('should return false if issue_date is missing', () => {
    const expiredToken: OAuth2Token = Object.assign({}, validToken, {issue_date: null});
    expect(TokenUtil.isValid(expiredToken)).toBeFalsy();
    expect(TokenUtil.isExpired(expiredToken)).toBeTruthy();
  });
});

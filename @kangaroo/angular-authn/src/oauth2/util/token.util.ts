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

import { OAuth2Token } from '../model/o-auth2-token';

/**
 * Utility for token management.
 */
export class TokenUtil {

  /**
   * Is this token set, valid, and unexpired?
   *
   * @param token The token to check.
   * @returns True if the token is valid, otherwise false.
   */
  public static isValid(token: OAuth2Token): boolean {
    if (!token) {
      return false;
    }

    const expiresOn = (token.issue_date || 0) + (token.expires_in || 0);
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return nowInSeconds < expiresOn;
  }

  /**
   * Is this token expired?
   *
   * @param token The token to check.
   * @returns True if the token is invalid, otherwise false.
   */
  public static isExpired(token: OAuth2Token): boolean {
    return !TokenUtil.isValid(token);
  }
}

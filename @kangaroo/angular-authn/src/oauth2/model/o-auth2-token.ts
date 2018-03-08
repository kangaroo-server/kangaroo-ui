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

/**
 * This interface describes an OAuth2 token received from the Kangaroo server.
 *
 * @author Michael Krotscheck
 */
export interface OAuth2Token {

  /**
   * The access token, used for authorizing subsequent calls.
   */
  access_token: string;

  /**
   * The type of token, usually 'Bearer'.
   */
  token_type: string;

  /**
   * The timestamp this token was issued.
   *
   * NOTE! This property is derived from the HTTP response. It is not
   * actually sent in the token, and must be set manually.
   */
  issue_date: number;

  /**
   * How soon the token expires, in seconds.
   */
  expires_in: number;

  /**
   * A refresh token id.
   */
  refresh_token?: string;

  /**
   * The list of scopes.
   */
  scope?: string;

}

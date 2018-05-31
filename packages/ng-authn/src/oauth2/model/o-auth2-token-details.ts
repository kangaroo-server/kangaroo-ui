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
 * This interface describes an OAuth2 token. In reality, it describes the
 * payload received from the introspection response, as it's a bit more complete
 * and useful than the raw token.
 *
 * @author Michael Krotscheck
 */
export interface OAuth2TokenDetails {

  /**
   * REQUIRED.  Boolean indicator of whether or not the presented token
   * is currently active.  The specifics of a token's "active" state
   * will vary depending on the implementation of the authorization
   * server and the information it keeps about its tokens, but a "true"
   * value return for the "active" property will generally indicate
   * that a given token has been issued by this authorization server,
   * has not been revoked by the resource owner, and is within its
   * given time window of validity (e.g., after its issuance time and
   * before its expiration time).  See Section 4 for information on
   * implementation of such checks.
   */
  active: boolean;

  /**
   * OPTIONAL.  A JSON string containing a space-separated list of
   * scopes associated with this token, in the format described in
   * Section 3.3 of OAuth 2.0 [RFC6749].
   */
  scope?: string;

  /**
   * OPTIONAL.  Client identifier for the OAuth 2.0 client that
   * requested this token.
   */
  client_id?: string;

  /**
   * OPTIONAL.  Human-readable identifier for the resource owner who
   * authorized this token.
   */
  username?: string;

  /**
   * OPTIONAL.  Type of the token as defined in Section 5.1 of OAuth
   * 2.0 [RFC6749].
   */
  token_type?: string;

  /**
   * OPTIONAL.  Integer timestamp, measured in the number of seconds
   * since January 1 1970 UTC, indicating when this token will expire,
   * as defined in JWT [RFC7519].
   */
  exp?: number;

  /**
   * OPTIONAL.  Integer timestamp, measured in the number of seconds
   * since January 1 1970 UTC, indicating when this token was
   * originally issued, as defined in JWT [RFC7519].
   */
  iat?: number;

  /**
   * OPTIONAL.  Integer timestamp, measured in the number of seconds
   * since January 1 1970 UTC, indicating when this token is not to be
   * used before, as defined in JWT [RFC7519].
   */
  nbf?: number;

  /**
   * OPTIONAL.  Subject of the token, as defined in JWT [RFC7519].
   * Usually a machine-readable identifier of the resource owner who
   * authorized this token.
   */
  sub?: string;

  /**
   * OPTIONAL.  Service-specific string identifier or list of string
   * identifiers representing the intended audience for this token, as
   * defined in JWT [RFC7519].
   */
  aud?: string;

  /**
   * OPTIONAL.  String representing the issuer of this token, as
   * defined in JWT [RFC7519].
   */
  iss?: string;

  /**
   * OPTIONAL.  String identifier for the token, as defined in JWT
   * [RFC7519].
   */
  jti?: string;

  /**
   * The spec also permits an arbitrary list of extension parameters.
   */
  [ key: string ]: string | number | boolean;
}

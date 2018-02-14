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

import { CommonModel } from './common.model';
import { TokenType } from './token-type.enum';

/**
 * This interface describes the database entity for an OAuth2 token. This is
 * notably different from the OAuth2Token model available from the login module,
 * though under the hood they represent the same entity.
 *
 * @author Michael Krotscheck
 */
export interface Token extends CommonModel {

  /**
   * The user identity UUID to whom this token has been issued.
   */
  identity: string;

  /**
   * The client UUID to whom this token has been issued.
   */
  client: string;

  /**
   * In the case of a refresh token, the auth token for whom this token is issued.
   */
  authToken: string;

  /**
   * The token type; referrer, bearer, etc.
   *
   * @see TokenType
   */
  tokenType: TokenType;

  /**
   * In how many seconds (since creation) will this token expire?
   */
  expiresIn: string;

  /**
   * The redirect provided to this token.
   */
  redirect: string;

  /**
   * The list of scopes that have been issued to this token.
   */
  scopes: string[];

}

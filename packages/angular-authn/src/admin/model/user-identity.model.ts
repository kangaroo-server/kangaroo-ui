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

import { CommonModel } from '@kangaroo/angular-platform';

/**
 * This interface describes a user identity.
 *
 * @author Michael Krotscheck
 */
export interface UserIdentity extends CommonModel {

  /**
   * Entity ID for the user to whom this identity belongs.
   */
  user: string;

  /**
   * The type of authenticator that issued this identity. We assume that each authenticator
   * will only retain unique user records.
   */
  type: string;

  /**
   * The unique ID issued by the authenticator's IDP.
   */
  remoteId: string;

  /**
   * A list of claims issued by the authenticator.
   */
  claims: Map<string, string>;

  /**
   * The user's encrypted password (without the salt). This value is write only by the API.
   */
  password: Map<string, string>;
}

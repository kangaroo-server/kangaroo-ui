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
 * This interface describes an authenticator and its configuration.
 *
 * @author Michael Krotscheck
 */
export interface Authenticator extends CommonModel {

  /**
   * Entity ID ID of the client to whom this authenticator is registered.
   */
  client: string;

  /**
   * The Authenticator type
   */
  type: string;

  /**
   * Configuration properties for this authenticator
   */
  configuration: Map<string, string>;
}

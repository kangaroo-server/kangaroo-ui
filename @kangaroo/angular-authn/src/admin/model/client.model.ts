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
import { ClientType } from './client-type.enum';

/**
 * This interface describes a client and its registration.
 *
 * @author Michael Krotscheck
 */
export interface Client extends CommonModel {

  /**
   * Entity ID ID of the application this client is registered to.
   */
  application: string;

  /**
   * Human readable name of this client.
   */
  name: string;

  /**
   * The client type.
   *
   * @see ClientType
   */
  type: ClientType;

  /**
   * Configuration properties for this client.
   */
  configuration: Map<string, string>;

  /**
   * The client shared secret, only used on clients that require this.
   */
  clientSecret: string;
}

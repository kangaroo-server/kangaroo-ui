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
 * This interface describes an application instance.
 *
 * @author Michael Krotscheck
 */
export interface Application extends CommonModel {

  /**
   * Entity ID ID of this application's owner.
   */
  owner?: string;

  /**
   * Entity ID for the default role.
   */
  defaultRole?: string;

  /**
   * Human readable name for this application.
   */
  name: string;

  /**
   * Description for this application.
   */
  description: string;

}

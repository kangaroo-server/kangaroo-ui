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

import { CommonModel } from '@kangaroo/ng-platform';

/**
 * This interface describes the user entity.
 *
 * @author Michael Krotscheck
 */
export interface User extends CommonModel {

  /**
   * Entity ID UUID of the application this role is registered to.
   */
  application: string;

  /**
   * Entity ID of the role assigned to this user.
   */
  role: string;

}

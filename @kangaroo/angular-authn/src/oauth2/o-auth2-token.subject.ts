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

import { LocalStorageSubject } from '@kangaroo/rxjs-storage';
import { OAuth2Token } from './model/o-auth2-token';

/**
 * This subject contains our OAuth2 token in its raw form.
 *
 * @author Michael Krotscheck
 */
export class OAuth2TokenSubject extends LocalStorageSubject<OAuth2Token> {

  /**
   * Create a new token subject.
   */
  constructor() {
    /* istanbul ignore next */
    super('_kangaroo_token');
  }
}

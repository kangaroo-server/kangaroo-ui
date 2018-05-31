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
 *
 */

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { AbstractResourceService } from '@kangaroo/ng-platform';
import { ObservableInput } from 'rxjs';
import { ADMIN_API_ROOT } from './admin-api-root';
import { Authenticator } from './model';

/**
 * This class provides a restful API for the authenticator resource.
 *
 * @author Michael Krotscheck
 */
@Injectable()
export class AuthenticatorService extends AbstractResourceService<Authenticator> {

  /**
   * This method should return the root url for the passed entity.
   *
   * @param http The HTTP client
   * @param apiRoot Provider for the admin API root url.
   */
  constructor(@Inject(HttpClient) http: HttpClient,
              @Optional() @Inject(ADMIN_API_ROOT) apiRoot: ObservableInput<string>) {
    super('authenticator', http, apiRoot);
  }
}

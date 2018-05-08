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

import { PlatformLocation } from '@angular/common';
import { Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';

/**
 * Root path to the oauth2 api, used for authentication. It is derived
 * from the application's own base path, and is assumed to be running
 * on the same host.
 *
 * @author Michael Krotscheck
 */
@Injectable()
export class OAuthApiRoot extends AsyncSubject<string> {

  /**
   * Create a new instance of this observable.
   *
   * @param {string} platformLocation Platform location.
   */
  constructor(platformLocation: PlatformLocation) {
    super();

    const origin = platformLocation && platformLocation['location'] && platformLocation['location'].origin;
    this.next(`${origin}/oauth2`);
    this.complete();
  }
}

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

import { OAuth2TokenSubject } from './o-auth2-token.subject';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { TokenUtil } from './util/token.util';
import { Injectable } from '@angular/core';

/**
 * Convenience injector. Are we logged in?
 *
 * @author Michael Krotscheck
 */
@Injectable()
export class LoggedInSubject extends ReplaySubject<boolean> {

  /**
   * The details subscription.
   */
  private subscription: Subscription;

  /**
   * Create a new token subject.
   */
  constructor(public token: OAuth2TokenSubject) {
    super(1);

    this.subscription = token
      .map((t) => TokenUtil.isValid(t))
      .subscribe((value) => this.next(value));
  }
}

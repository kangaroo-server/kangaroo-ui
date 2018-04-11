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

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { OAuth2TokenSubject } from './o-auth2-token.subject';
import { Subscription } from 'rxjs/Subscription';
import { OAuth2Service } from './o-auth2.service';
import { OAuth2TokenDetails } from './model/o-auth2-token-details';
import { Injectable } from '@angular/core';

/**
 * This subject contains the introspected content of the OAuth2 Token.
 *
 * @author Michael Krotscheck
 */
@Injectable()
export class OAuth2TokenDetailsSubject extends ReplaySubject<OAuth2TokenDetails> {

  /**
   * The details subscription.
   */
  private subscription: Subscription;

  /**
   * Create a new token subject.
   */
  constructor(public token: OAuth2TokenSubject,
              public service: OAuth2Service) {
    super(1);

    this.subscription = token
      .mergeMap((t) => service.introspect(t))
      .subscribe(
        (details) => this.next(details),
        () => this.next({active: false}));
  }
}

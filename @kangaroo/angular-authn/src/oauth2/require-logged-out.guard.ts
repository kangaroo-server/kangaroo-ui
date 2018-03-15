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

import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { OAuth2TokenSubject } from './o-auth2-token.subject';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/filter';
import { TokenUtil } from './util/token.util';

/**
 * Ths route guard ensures that the user is currently logged out.
 *
 * @author Michael Krotscheck
 */
@Injectable()
export class RequireLoggedOutGuard implements CanActivate {

  /**
   * Constructor.
   *
   * @param tokenSubject The token subject, will only contain data if valid.
   */
  constructor(private tokenSubject: OAuth2TokenSubject) {
  }

  /**
   * The guard only permits activation if the detected auth token exists.
   *
   * @return An observable, resolving to true if the token indicates the user is logged out.
   */
  public canActivate(): Observable<boolean> {
    return this.tokenSubject.map(t => !TokenUtil.isValid(t));
  }
}

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

import { Component } from '@angular/core';
import { LoggedInSubject, OAuth2Service, OAuth2TokenSubject } from '@kangaroo/angular-authn';

/**
 * The application header.
 *
 * @author Michael Krotscheck
 */
@Component({
  selector: 'kng-header',
  styleUrls: ['header.component.scss'],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  /**
   * Is the user currently logged in?
   */
  public loggedIn = false;

  /**
   * Create a new header component.
   */
  constructor(public loggedInSubject: LoggedInSubject,
              private tokenSubject: OAuth2TokenSubject,
              private tokenService: OAuth2Service) {
    this.loggedInSubject
      .subscribe((li) => this.loggedIn = li);
  }

  /**
   * Issue a token revocation request with the current token.
   */
  public logout() {
    this.tokenSubject
      .switchMap((token) => this.tokenService.revoke(token))
      .subscribe();
  }
}

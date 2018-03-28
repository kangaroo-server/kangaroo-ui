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
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OAuth2TokenSubject } from '@kangaroo/angular-authn';
import { OAuth2Service } from '@kangaroo/angular-authn';

/**
 * This component renders the login form.
 *
 * @author Michael Krotscheck
 */
@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements AfterViewInit {

  /**
   *  This variable contains the username input in the form.
   *
   * @type {string}
   */
  public username = '';

  /**
   * This variable contains the password input into the form.
   * @type {string}
   */
  public password = '';

  /**
   * Did the last login error?
   *
   * @type {boolean}
   */
  public errored = false;

  /**
   * Are we currently loading?
   *
   * @type {boolean}
   */
  public loading = false;

  /**
   * The username input field.
   */
  @ViewChild('usernameInput')
  public usernameInput: ElementRef;

  /**
   * Create a new instance of this component.
   *
   * @param {OAuth2Service} oauth2 The login service.
   * @param {OAuth2TokenSubject} oauth2Token The OAuth2 Token subject.
   * @param {Router} router The router.
   */
  constructor(private oauth2: OAuth2Service,
              private oauth2Token: OAuth2TokenSubject,
              private router: Router) {
  }

  /**
   * After view init, focus the login field.
   */
  ngAfterViewInit(): void {
    this.usernameInput.nativeElement.focus();
  }

  /**
   * Login the user.
   */
  public login() {
    this.errored = false;
    this.loading = true;
    this.oauth2
      .login(this.username, this.password)
      .finally(() => this.loading = false)
      .subscribe(
        () => this.router.navigate(['']),
        () => this.errored = true
      );
  }
}

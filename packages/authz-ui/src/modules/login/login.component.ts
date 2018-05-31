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
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { OAuth2Service, OAuth2TokenSubject } from '@kangaroo/ng-authn';
import { finalize } from 'rxjs/internal/operators';
import { FormUtil } from '../utils/form.util';

/**
 * This component renders the login form.
 *
 * TODO: Layout
 * TODO: Error on response
 *
 * @author Michael Krotscheck
 */
@Component({
  templateUrl: './login.component.html',
  styleUrls: [ 'login.component.scss' ],
})
export class LoginComponent {

  /**
   * The login form control.
   *
   * @type {FormControl}
   */
  public loginGroup: FormGroup = new FormGroup({
    login: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ]),
  });

  /**
   * Create a new instance of this component.
   *
   * @param {OAuth2Service} oauth2 The login service.
   * @param {OAuth2TokenSubject} oauth2Token The OAuth2 Token subject.
   * @param {Router} router The router.
   * @param snackBar the error response controller.
   */
  constructor(private oauth2: OAuth2Service,
              private oauth2Token: OAuth2TokenSubject,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  /**
   * Convert a control event into an error message.
   *
   * @param control The form control
   * @returns Error message, as appropriate.
   */
  public getErrorMessage(control: FormControl) {
    return FormUtil.getErrorMessage(control.errors);
  }

  /**
   * Login the user.
   */
  public login() {
    const {login, password} = this.loginGroup.value;

    this.loginGroup.disable();
    this.oauth2
      .login(login, password)
      .pipe(finalize(() => this.loginGroup.enable()))
      .subscribe(
        () => this.router.navigate([ '' ]),
        () => this.snackBar.open('Invalid credentials, please try again.', 'Dismiss', {duration: 2000}),
      );
  }
}

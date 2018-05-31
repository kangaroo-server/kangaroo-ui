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

import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ApplicationService } from '@kangaroo/ng-authn';
import { finalize } from 'rxjs/internal/operators';
import { FormUtil } from '../../utils/form.util';

/**
 * The component to create a new application.
 *
 * @author Michael Krotscheck
 */
@Component({
  styleUrls: [ 'application-create.component.scss' ],
  templateUrl: './application-create.component.html',
})
export class ApplicationCreateComponent {

  /**
   * The application creation form.
   *
   * @type {FormControl}
   */
  public applicationCreateGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
      Validators.minLength(3),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
      Validators.minLength(3),
    ]),
    defaultRole: new FormControl(''),
  });

  /**
   * Create a new instance of this component.
   *
   */
  constructor(private appService: ApplicationService,
              private router: Router,
              private location: Location,
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
   * Submit the form, creating the new application.
   */
  public create() {
    const {name, description} = this.applicationCreateGroup.value;

    this.applicationCreateGroup.disable();
    this.appService.create({
      name,
      description,
    })
      .pipe(finalize(() => this.applicationCreateGroup.enable()))
      .subscribe(
        (newApp) => this.router.navigate([ 'application', newApp.id ]),
        () => this.snackBar.open('An error occurred while sending the request, please try again later.',
          'Dismiss', {duration: 2000}),
      );
  }

  /**
   * Cancel the request, go back in history.
   */
  public cancel() {
    this.location.back();
  }
}

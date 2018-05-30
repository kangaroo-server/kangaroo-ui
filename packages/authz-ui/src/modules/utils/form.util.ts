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

import { ValidationErrors } from '@angular/forms';

/**
 * Common error messages.
 */
const errorMessages: { [ key: string ]: (params) => string } = {
  maxlength: ({requiredLength}) => `Please enter no more than ${requiredLength} characters.`,
  minlength: ({requiredLength}) => `Please enter at least ${requiredLength} characters.`,
  required: () => 'You must enter a value.',
};

/**
 * A collection of utility methods to assist with reactive forms.
 *
 * @author Michael Krotscheck
 */
export class FormUtil {

  /**
   * Select and format error messages in a consistent fashion.
   *
   * @param errors: A list of form errors.
   */
  public static getErrorMessage(errors: ValidationErrors) {
    const errorKey = Object.keys(errors)[ 0 ];
    const params = errors[ errorKey ];

    if (errorMessages.hasOwnProperty(errorKey)) {
      return errorMessages[ errorKey ](params);
    }
    return 'An error occurred.';
  }
}

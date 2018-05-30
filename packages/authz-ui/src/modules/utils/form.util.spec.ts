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

import { FormUtil } from './form.util';

/**
 * Unit tests for the form util.
 */
describe('FormUtil', () => {

  describe('getErrorMessage', () => {

    it('unknown', () => {
      const message = FormUtil.getErrorMessage({unknown: {unknown: 10}});
      expect(message).toEqual('An error occurred.');
    });
    it('maxlength', () => {
      const message = FormUtil.getErrorMessage({maxlength: {requiredLength: 10}});
      expect(message).toEqual('Please enter no more than 10 characters.');
    });
    it('minlength', () => {
      const message = FormUtil.getErrorMessage({minlength: {requiredLength: 10}});
      expect(message).toEqual('Please enter at least 10 characters.');
    });
    it('required', () => {
      const message = FormUtil.getErrorMessage({required: {}});
      expect(message).toEqual('You must enter a value.');
    });
  });
});

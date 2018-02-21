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

import { async, inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { AdminApiRoot } from './admin-api-root';

/**
 * Unit tests for the API Root of the Admin root service.
 */
describe('AdminApiRoot', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ AdminApiRoot ],
      imports: [ BrowserModule ]
    });
  });

  it('should extrapolate the oauth2 endpoint', async(inject([ AdminApiRoot ], (root) => {
    const expected = `${window.location.protocol}//${window.location.host}/v1`;
    root.subscribe((url) => expect(url).toEqual(expected));
  })));

  it('should be complete', async(inject([ AdminApiRoot ], (root) => {
    expect(root.hasCompleted).toBeTruthy();
  })));
});

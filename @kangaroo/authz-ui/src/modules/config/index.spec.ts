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
import * as all from './index';
import { ConfigModule } from './index';
import { TestBed } from '@angular/core/testing';

/**
 * Unit tests for the ConfigModule
 */
describe('ConfigModule', () => {

  const expectedExports = [
    'ConfigModule',
    'KangarooConfigurationSubject',
    'AdminApiRoot',
    'OAuthApiRoot'
  ];

  expectedExports.forEach((name) => {
    it(`should export ${name}`, () => {
      expect(all.hasOwnProperty(name)).toBeTruthy();
    });
  });

  describe('module', () => {

    it('should permit importing', () => {
      TestBed.configureTestingModule(
        {
          imports: [
            ConfigModule
          ],
          providers: []
        }).compileComponents();
    });
  });
});

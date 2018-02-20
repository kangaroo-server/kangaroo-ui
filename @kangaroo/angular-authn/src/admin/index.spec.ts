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
import { KangarooAuthorizationAdminModule } from './index';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';

/**
 * Unit tests for the KangarooAuthorizationAdminModule
 */
describe('KangarooAuthorizationAdminModule', () => {

  const expectedExports = [
    'KangarooAuthorizationAdminModule',
    'ApplicationService',
    'AuthenticatorService',
    'ClientService',
    'ClientRedirectService',
    'ClientReferrerService',
    'RoleService',
    'ScopeService',
    'TokenService',
    'UserService',
    'UserIdentityService',

    'ClientType',
    'TokenType',
    'SortOrder',
    'ADMIN_API_ROOT'
  ];

  expectedExports.forEach((name) => {
    it(`should export ${name}`, () => {
      expect(all.hasOwnProperty(name)).toBeTruthy();
    });
  });

  it('should only export expected properties', () => {
    Object.keys(all).forEach((name) => {
      expect(expectedExports.indexOf(name)).not.toEqual(-1, `Unexpected export found: ${name}`);
    });
  });

  describe('module', () => {

    it('should permit importing', () => {
      TestBed.configureTestingModule(
        {
          imports: [
            BrowserModule,
            HttpClientTestingModule,
            KangarooAuthorizationAdminModule
          ]
        }).compileComponents();
    });
  });
});

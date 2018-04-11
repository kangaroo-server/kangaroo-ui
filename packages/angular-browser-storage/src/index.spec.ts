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
import { BrowserStorageModule } from './index';
import { async, inject, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { WINDOW } from './window';
import { LocalStore } from './local.store';
import { MemoryStore } from './memory.store';
import { SessionStore } from './session.store';

/**
 * A test component that can be overridden on a test-by-test basis.
 */
@Component({template: `<p></p>`})
class StubComponent {
}

/**
 * Unit tests for the BrowserModule
 */
describe('BrowserModule', () => {

  const expectedExports = [
    'BrowserStorageModule',

    'LocalStore',
    'SessionStore',
    'MemoryStore'
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

  describe('when imported', () => {
    const expectedTypes: { name: string }[] = <any> [
      WINDOW,
      LocalStore,
      MemoryStore,
      SessionStore
    ];
    const expectedComponents = [];
    const expectedPipes = [];

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          BrowserStorageModule
        ],
        declarations: [
          StubComponent
        ]
      });
    });

    // Dynamically generate tests for all components in the above list.
    expectedTypes.forEach((injectedType) => {
      it(`should permit injection of ${injectedType.name}`, async(inject([ injectedType ], (component) => {
        expect(component).toBeDefined();
      })));
    });

    expectedComponents.forEach((injectedType) => {
      it(`should provide component: ${injectedType.name}`, async(() => {
        expect(TestBed.createComponent(injectedType)).toBeDefined();
      }));
    });

    // Dynamic test generation? Crazypants.
    expectedPipes.forEach((pipename) => {

      it(`should permit usage of the '${pipename}' pipe`, () => {
        TestBed.overrideComponent(StubComponent, {
          set: {
            template: `<p>{{'this is a test' | ${pipename}}}</p>`
          }
        });

        const component = TestBed.createComponent(StubComponent);
        component.whenStable();
        expect(component).toBeDefined();
      });
    });
  });
});

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

import { inject, TestBed } from '@angular/core/testing';
import { locationInitializer } from './router_util';
import { APP_INITIALIZER, Injector } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NoopComponent } from './index';
import { CommonModule } from '@angular/common';

/**
 * Unit tests for the router utility injector
 */
describe('Router utility export', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: APP_INITIALIZER, multi: true, useFactory: locationInitializer, deps: [ Injector ]}
      ],
      declarations: [
        NoopComponent
      ],
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([
          {path: '', component: NoopComponent}
        ])
      ]
    });
  });

  it('should create the utility method on the router', inject([], () => {
    expect(window.routerNavigateByUrl).toBeDefined();
  }));

  it('should permit invoking the router directly', inject([ Router ], (router) => {
    const routerSpy = spyOn(router, 'navigateByUrl').and.stub();
    window.routerNavigateByUrl('/');
    expect(routerSpy).toHaveBeenCalledWith('/', {skipLocationChange: false, replaceUrl: true});
  }));

  afterEach(() => {
    delete window.routerNavigateByUrl;
  });
});

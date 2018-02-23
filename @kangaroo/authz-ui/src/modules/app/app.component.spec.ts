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

import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { Location } from '@angular/common';

import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { ConfigModule } from '../config';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopComponent } from './noop.component';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'configuration-failed', component: NoopComponent}
        ]),
        ConfigModule,
        HttpClientTestingModule
      ],
      declarations: [
        NoopComponent,
        AppComponent,
        HeaderComponent
      ]
    });
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should contain a header`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const header = fixture.debugElement.query(By.directive(HeaderComponent));
    expect(header).toBeDefined();
  }));

  it('should contain a router outlet', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeDefined();
  }));

  it('should redirect if the configuration fails',
    fakeAsync(inject([ HttpTestingController, Location ], (http, location) => {
      const fixture = TestBed.createComponent(AppComponent);

      http
        .expectOne((req) => {
          return req.url.indexOf('/v1/config') > -1;
        })
        .error(null, {status: 404, statusText: 'not found'});
      tick();
      expect(location.path()).toBe('/configuration-failed');
    })));
});
